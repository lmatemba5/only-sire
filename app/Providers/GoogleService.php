<?php

namespace App\Providers;

use App\Jobs\Candidate\SaveDocumentManager;
use App\Models\Bucket;
use App\Models\Candidate;
use App\Models\Month;
use App\Models\Venue;
use Google\Client;
use Google\Service\Docs;
use Google\Service\Docs\BatchUpdateDocumentRequest;
use Google\Service\Docs\Request as GoogleRequest;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;
use Google\Service\Exception;
use Google\Service\Gmail;
use Google\Service\Gmail\Message;
use Google\Service\Sheets;
use Google\Service\Sheets\BatchUpdateSpreadsheetRequest;
use Google\Service\Sheets\BooleanCondition;
use Google\Service\Sheets\DataValidationRule;
use Google\Service\Sheets\Request;
use Google\Service\Sheets\ValueRange;

class GoogleService
{
    protected $client;
    protected $candidate;
    protected $venue;
    private $totalScore = 0;

    public function __construct($candidate_id = null, protected $creatorName = null, $venue_id = null)
    {
        if ($candidate_id) {
            $this->candidate = Candidate::with('bucket', 'venue', 'venue.month', 'venue.month.year', 'venue.venueDrives', 'venue.venueDrives.drive')->find($candidate_id);
        }

        if ($venue_id) {
            $this->venue = Venue::with('venueDrives', 'venueDrives.drive', 'month', 'month.year', 'country')->find($venue_id);
        }

        // google API init
        $this->client = new Client();
        $this->client->setAuthConfig(config('services.google.json_path'));
        $this->client->setAccessType('offline');
        $this->client->setScopes([
            Sheets::SPREADSHEETS,
            Docs::DOCUMENTS,
            Drive::DRIVE,
            Gmail::GMAIL_SEND
        ]);
    }

    public function getSheetsService()
    {
        return new Sheets($this->client);
    }

    public function getGmail()
    {
        $this->client->setSubject(email());
        return new Gmail($this->client);
    }

    public function getDriveService()
    {
        return new Drive($this->client);
    }

    public function getDocsService()
    {
        return new Docs($this->client);
    }


    private function candidate_details($creatorName)
    {
        # $cd is short form for candidate_details
        $cd = array_reverse([
            [98, $this->candidate->name],
            [111, $this->candidate->phone],
            [120, "{$this->candidate->age}"],
            [132, $this->candidate->village],
            [145, $this->candidate->district],
            [163, $this->candidate->marital_status],
            [174, $this->candidate->email ?: 'N/A'],
            [183, $this->candidate->venue->created_at->format('d F Y')],
            [196, $this->candidate->facebook_link ?: 'N/A'],
            [209, $this->candidate->instagram_link ?: 'N/A'],
            [222, $this->candidate->linkedin_link ?: 'N/A'],
            [233, $this->candidate->twitter_link ?: 'N/A'],
            [251, $creatorName],
            [261, now()->format('h:i a')],
            [278, "{$this->candidate->village} Village, TA {$this->candidate->ta}, {$this->candidate->district} District"],
        ]);

        return $cd;
    }

    public function sendEmail($to, $subject, $body)
    {
        $message = new Message();
        $rawMessageString = "From: ".email()."\r\n";
        $rawMessageString .= "To: $to\r\n";
        $rawMessageString .= "Subject: $subject\r\n";
        $rawMessageString .= "MIME-Version: 1.0\r\n";
        $rawMessageString .= "Content-Type: text/html; charset=utf-8\r\n\r\n";
        $rawMessageString .= $body;

        $encodedMessage = base64_encode($rawMessageString);
        $message->setRaw(str_replace(['+', '/', '='], ['-', '_', ''], $encodedMessage));

        $this->getGmail()->users_messages->send('me', $message);
    }

    private function addition_question_details()
    {
        /*
        $aqd is short form for addition_question_details
        $addqns is short form for addition_questions
         */
        $addqns = $this->candidate->dawah_attributes->addition_questions;

        $aqd = array_reverse([
            [5442, $addqns->prev_job ?: 'N/A'],
            [5500, $addqns->when_to_start ?: 'N/A'],
            [5542, $addqns->planned_holidays ?: 'N/A'],
            [5609, $addqns->prev_org ?: 'N/A'],
            [5699, $addqns->prev_org_objective ?: 'N/A'],
            [5758, $addqns->iera_friends ?: 'N/A'],
            [5833, $addqns->questions ?: 'N/A'],
        ]);
        return $aqd;
    }

    private function interview_checklist()
    {
        /*
        $ic is short form for interview_checklist

        $checklist->wp => well presented,
        $checklist->pbl => postive body language
        $checklist->a => attentive
        $checklist->pa => postive attitude
        $checklist->ot => on time
         */
        $checklist = $this->candidate->dawah_attributes->checklist;

        $checklistTotal = $checklist->wp + $checklist->pbl + $checklist->a + $checklist->pa + $checklist->ot;

        $this->totalScore += $checklistTotal;

        $ic = array_reverse([
            [4787, $checklist->wp],
            [4827, $checklist->pbl],
            [4856, $checklist->a],
            [4893, $checklist->pa],
            [4921, $checklist->ot],
            [4943, "{$checklistTotal}"],
        ]);

        return $ic;
    }

    private function interview_questions()
    {
        $dattr = $this->candidate->dawah_attributes;

        $interviewScore = $dattr->education->marks + $dattr->basic_islamic_knowledge->marks + $dattr->dawah_knowledge->marks + $dattr->dawah_experience->marks + $dattr->travel->marks + $dattr->people_skills->marks + $dattr->language_skills->marks + $dattr->computer_skills->marks + $dattr->team_management->marks + $dattr->reporting_skills->marks + $dattr->complementary_skills->marks;

        //updating candidate total score
        $this->totalScore += $interviewScore;

        /*
        $dattr => dawah attributes for candidate
        below are candidate interview responses
         */
        $iq = array_reverse([
            [1015, $dattr->education->marks],
            [1148, $dattr->education->text],

            [1444, $dattr->basic_islamic_knowledge->marks],
            [1719, $dattr->basic_islamic_knowledge->text],

            [1861, $dattr->dawah_knowledge->marks],
            [1997, $dattr->dawah_knowledge->text],

            [2279, $dattr->dawah_experience->marks],
            [2448, $dattr->dawah_experience->text],

            [2640, $dattr->travel->marks],
            [2825, $dattr->travel->text],

            [3054, $dattr->people_skills->marks],
            [3252, $dattr->people_skills->text],

            [3344, $dattr->language_skills->marks],
            [3619, $dattr->language_skills->text],

            [3706, $dattr->computer_skills->marks],
            [3841, $dattr->computer_skills->text],

            [3941, $dattr->team_management->marks],
            [4077, $dattr->team_management->text],

            [4185, $dattr->reporting_skills->marks],
            [4307, $dattr->reporting_skills->text],

            [4574, $dattr->complementary_skills->marks],
            [4696, $dattr->complementary_skills->text],

            [4717, "{$interviewScore}"],
        ]);

        return $iq;
    }

    private function recommendation_details()
    {
        $dattr = $this->candidate->dawah_attributes;

        $this->totalScore += $dattr->recommendation->marks;

        // see the method above for $dattr hint
        return array_reverse([
            [5176, $dattr->recommendation->marks],
            [5184, $dattr->recommendation->text],
            [5199, "{$this->totalScore}"],
        ]);
    }

    public function saveCandidate2Cloud()
    {
        //array for google api batchupdate
        $requests = [];

        //aggregating all interview data
        $interviewFormData = [
            $this->addition_question_details(),
            null,
            $this->interview_checklist(),
            $this->interview_questions(),
            $this->candidate_details($this->creatorName),
        ];

        $interviewFormData[1] = $this->recommendation_details();

        //creating a request for each aggregated interview data
        foreach ($interviewFormData as $dataSegment) {
            foreach ($dataSegment as $cell) {
                $requests[] = new GoogleRequest([
                    'insertText' => [
                        'text' => "{$cell[1]}",
                        'location' => [
                            'index' => $cell[0],
                        ],
                    ],
                ]);
            }
        }

        if (!app()->environment('local')) {
            $requests[] = new GoogleRequest([
                'insertInlineImage' => [
                    'uri' =>$this->candidate->bucket->getMedia('ph')->first()->getUrl('thumb'),
                    'location' => [
                        'index' => 53,
                    ],
                    'objectSize' => [
                        'height' => [
                            'magnitude' => 200,
                            'unit' => 'PT',
                        ],
                        'width' => [
                            'magnitude' => 200,
                            'unit' => 'PT',
                        ],
                    ],
                ],
            ]);
        }

        $docsService = $this->getDocsService();
        $driveService = $this->getDriveService();

        //creating a new candidate's google doc form
        $candidateForm = new DriveFile([
            'name' => $this->candidate->name,
        ]);

        //fetching parent id for candidate's form
        foreach ($this->candidate->venue->venueDrives as $venueDrive) {
            if ($venueDrive->drive->tag == 'fo') {
                $candidateForm->setParents([$venueDrive->google_drive_id]);
                break;
            }
        }

        //this is a template for candidate's google doc form
        $templateId = '1Qd5KpChj0c9e3QlafXwn8YXfJbZ2ZJ_gQL7dSuu2Tv8';

        //copying template document
        $candidateForm = $driveService->files->copy($templateId, $candidateForm, [
            'fields' => 'id,webViewLink',
        ]);

        //Execute the batch update
        $batchUpdateRequest = new BatchUpdateDocumentRequest([
            'requests' => $requests,
        ]);

        try {
            $docsService->documents->batchUpdate($candidateForm->id, $batchUpdateRequest);

            $sheetService = $this->getSheetsService();
            $range = "{$this->candidate->venue->open_at->format('d F')} - {$this->candidate->venue->district_name} {$this->candidate->venue->venue_name}!A:X";
            $settings = $this->getSettings($sheetService);
            $interviewFormLink = $candidateForm->getWebViewLink();

            // Data to insert
            $values = [
                $this->candidate->name,
                $this->candidate->related_to ?: 'N/A', //related to
                $this->candidate->gender,
                '', //fees
                "Village Da'wah", //recommended for
                $this->candidate->email ?: 'N/A',
                '=HYPERLINK("https://drive.google.com/file/d/' . $this->candidate->bucket->id_google_drive_id . '/view", "Link")', //id link
                '', //phone
                '=HYPERLINK("https://drive.google.com/file/d/' . $this->candidate->bucket->cv_google_drive_id . '/view", "Link")', //cv link
                '=HYPERLINK("' . $interviewFormLink . '", "Link")',
                $this->candidate->facebook_link ? '=HYPERLINK("' . $this->candidate->facebook_link . '", "Link")' : 'N/A',

                '', //risk assessment
                $this->candidate->district,
                "{$this->candidate->village} Village, TA {$this->candidate->ta},{$this->candidate->district} District",
                $this->candidate->instagram_link ? '=HYPERLINK("' . $this->candidate->instagram_link . '", "Link")' : 'N/A',
                $this->candidate->twitter_link ? '=HYPERLINK("' . $this->candidate->twitter_link . '", "Link")' : 'N/A',
                'N/A', //youtube link
                '', //interview status
                '', //risk assessment status
                '', //call status
                '', //indunction status
                '', //started with iera month
                '', //region
                '', //working elsewhere
            ];

            $body = new ValueRange([
                'values' => [$values],
            ]);

            $params = [
                'valueInputOption' => 'USER_ENTERED',
            ];

            $response = $sheetService->spreadsheets_values->append(
                $this->candidate->venue->month->year->google_workbook_id,
                $range,
                $body,
                $params
            );

            $this->insertDropdowns($sheetService, $response, $this->candidate->venue->google_sheet_id, $settings);
        } catch (Exception $ex) {
            if (!str_contains(json_decode($ex->getMessage())->error->message, 'Invalid JSON payload received')) {
                throw $ex;
            };
        }
    }

    public function createInterviewDirectories()
    {
        $driveService = $this->getDriveService();
        $sheetService = $this->getSheetsService();

        /*
        dfs => drive file(s)
        ydfs => year drive files etc
         */

        try {
            $ydfs = $driveService->files->listFiles([
                'spaces' => 'drive',
                'q' => "name='" . now()->format('Y') . "' and '{$this->venue->country->google_drive_id}' in parents",
                'fields' => 'files(id)',
            ])->getFiles();

            if (count($ydfs) > 0) {
                $ydf = $ydfs[0];
            } else {
                $ydf = $driveService->files->create(
                    new DriveFile([
                        'name' => now()->format('Y'),
                        'mimeType' => 'application/vnd.google-apps.folder',
                        'parents' => [$this->venue->country->google_drive_id],
                    ]),
                    [
                        'fields' => 'id',
                    ]
                );
            }

            if($this->venue->year->google_drive_id == null) {
                $this->venue->year->update([
                    'google_drive_id' => $ydf->id,
                ]);

                $this->venue->refresh();
            }

            //spreDB => spreedsheet for this venue
            $spreDB = $driveService->files->listFiles([
                'spaces' => 'drive',
                'q' => "name='{$this->venue->open_at->format('Y')} {$this->venue->country->name} Candidates Datadase' and '" . $ydf->id . "' in parents",
                'fields' => 'files(id)',
            ])->getFiles();

            if (count($spreDB) == 0) {
                $workbook = $driveService->files->create(
                    new DriveFile([
                        'name' => "{$this->venue->open_at->format('Y')} {$this->venue->country->name} Candidates Datadase",
                        'mimeType' => 'application/vnd.google-apps.spreadsheet',
                        'parents' => [$ydf->id],
                    ]),
                    [
                        'fields' => 'id',
                    ]
                );

                $this->venue->year->update([
                    'google_workbook_id' => $workbook->id,
                ]);

                $sheetService->spreadsheets->batchUpdate($this->venue->year->google_workbook_id, new BatchUpdateSpreadsheetRequest([
                    'requests' => [
                        new Request([
                            'updateSheetProperties' => [
                                'properties' => [
                                    'sheetId' => 0,
                                    'title' => "{$this->venue->open_at->format('d F')} - {$this->venue->district_name} {$this->venue->venue_name}",
                                ],
                                'fields' => 'title',
                            ],
                        ]),
                    ],
                ]));

                $this->initializeSheet($sheetService, 0);

                $this->venue->update([
                    'google_sheet_id' => 0,
                ]);

                $this->venue->refresh();
            }

            if ($this->venue->google_sheet_id == null) {
                $sheets = $sheetService->spreadsheets->get($this->venue->year->google_workbook_id)->getSheets();

                $found = false;
                $sheetId = null;
                $sheetTitle = "{$this->venue->open_at->format('d F')} - {$this->venue->district_name} {$this->venue->venue_name}";

                foreach ($sheets as $sheet) {
                    $title =$sheet->getProperties()->getTitle();

                    if ($title == $sheetTitle) {
                        $found = true;
                    }

                    if (str_contains(strtolower($title), 'sheet')) {
                        $sheetId = $sheet->getProperties()->getSheetId();
                    }
                }


                if (!$found) {
                    $requests =[
                        new Request([
                            'addSheet' => [
                                'properties' => [
                                    'title' => $sheetTitle,
                                ],
                            ],
                        ])
                    ];

                    if($sheetId != null) {
                        $requests[] = new Request([
                            'deleteSheet' => [
                                'sheetId' => $sheetId,
                            ],
                        ]);
                    }

                    $response = $sheetService->spreadsheets->batchUpdate(
                        $this->venue->year->google_workbook_id,
                        new BatchUpdateSpreadsheetRequest([
                            'requests' => $requests
                        ])
                    );

                    $sheetId = $response->getReplies()[0]->getAddSheet()->getProperties()->getSheetId();
                    $this->initializeSheet($sheetService, $sheetId);

                    $this->venue->update([
                        'google_sheet_id' => $sheetId,
                    ]);
                }
            }

            $mdfs = $driveService->files->listFiles([
                'spaces' => 'drive',
                'q' => "name='{$this->venue->open_at->format('F')}' and '" . $ydf->id . "' in parents",
                'fields' => 'files(id)',
            ])->getFiles();

            if (count($mdfs) > 0) {
                $mdf = $mdfs[0];
            } else {
                $mdf = $driveService->files->create(
                    new DriveFile([
                        'name' => "{$this->venue->open_at->format('F')}",
                        'mimeType' => 'application/vnd.google-apps.folder',
                        'parents' => [$ydf->id],
                    ]),
                    [
                        'fields' => 'id',
                    ]
                );
            }

            if ($this->venue->month->google_drive_id == null) {
                $this->venue->month->update([
                    'google_drive_id' => $mdf->id,
                ]);
            } else if ($mdf->id != $this->venue->month->google_drive_id) {
                $month = Month::create([
                    'year_id' => $this->venue->year_id,
                    'google_drive_id' => $mdf->id,
                    'uuid' => $this->venue->open_at->format('Y-m'),
                ]);

                $this->venue->update([
                    'month_id' => $month->id,
                ]);

                $this->venue->refresh();
            }

            if ($this->venue->google_drive_id == null) {
                $venueDriveFolder = $driveService->files->create(
                    new DriveFile([
                        'name' => "{$this->venue->district_name} {$this->venue->venue_name}",
                        'mimeType' => 'application/vnd.google-apps.folder',
                        'parents' => [$this->venue->month->google_drive_id],
                    ]),
                    [
                        'fields' => 'id',
                    ]
                );

                $this->venue->update([
                    'google_drive_id' => $venueDriveFolder->id,
                ]);
            }

            foreach ($this->venue->venueDrives as $key => $venueDrive) {
                $contentDrive = $driveService->files->create(
                    new DriveFile([
                        'name' => (1 + $key) . '. ' . ($venueDrive->drive_name ?: $venueDrive->drive->name),
                        'mimeType' => 'application/vnd.google-apps.folder',
                        'parents' => [$this->venue->google_drive_id],
                    ]),
                    [
                        'fields' => 'id',
                    ]
                );

                $venueDrive->update([
                    'google_drive_id' => $contentDrive->id,
                ]);
            }
        } catch (Exception $ex) {
            throw $ex;
        }
    }

    public function initializeSheet($sheetService, $sheetId = 0)
    {
        $values = [
            'Name',
            'Related To',
            'Gender',
            'Fees',
            "Recommended For",
            'Email',
            'ID No',
            "Phone #",
            'CV',
            'Interview Form',
            'Facebook',
            'Risk Assessment',
            "Location",
            "Full Address",
            'Instagram',
            'Twitter',
            'Youtube',
            'Interview Status',
            'Risk Assessment Status',
            'Call Status',
            'Indunction Status',
            'Month Started with IERA',
            'Region',
            'Working Elsewhere',
        ];

        $body = new ValueRange([
            'values' => [$values],
        ]);

        $params = [
            'valueInputOption' => 'RAW',
        ];

        $sheetService->spreadsheets_values->append(
            $this->venue->year->google_workbook_id,
            "'{$this->venue->open_at->format('d F')} - {$this->venue->district_name} {$this->venue->venue_name}'!A1:X1",
            $body,
            $params
        );

        $requests = [
            new Request([
                'repeatCell' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'startRowIndex' => 0,
                        'endRowIndex' => 1,
                        'startColumnIndex' => 0,
                        'endColumnIndex' => 24,
                    ],
                    'cell' => [
                        'userEnteredFormat' => [
                            'backgroundColor' => [
                                "red" => 52 / 255,
                                "green" => 168 / 255,
                                "blue" => 83 / 255,
                            ],
                            'textFormat' => [
                                "foregroundColor" => [
                                    "red" => 1,
                                    "green" => 1,
                                    "blue" => 1,
                                ],
                                "fontSize" => 16,
                                "bold" => true,
                            ],
                        ],
                    ],
                    'fields' => 'userEnteredFormat.backgroundColor,userEnteredFormat.textFormat',
                ],
            ]),
            new Request([
                'updateDimensionProperties' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'dimension' => 'ROWS',
                        'startIndex' => 0,
                        'endIndex' => 1,
                    ],
                    'properties' => [
                        'pixelSize' => 35,
                    ],
                    'fields' => 'pixelSize',
                ],
            ]),
        ];

        $batchUpdateRequest = new BatchUpdateSpreadsheetRequest([
            'requests' => $requests,
        ]);

        $sheetService->spreadsheets->batchUpdate($this->venue->year->google_workbook_id, $batchUpdateRequest);
    }

    private function insertDropdowns($sheetService, $response, $sheetId, $settings)
    {
        $lastInsertRow = (int) explode("X", $response->getUpdates()->getUpdatedRange())[1];
        $spreadsheetId = $response->getSpreadsheetId();

        // Define the requests array
        $requests = [
            new Request([
                'updateCells' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'startRowIndex' => $lastInsertRow - 1,
                        'endRowIndex' => $lastInsertRow,
                        'startColumnIndex' => 8 - 1,
                        'endColumnIndex' => 8,
                    ],
                    'rows' => [
                        'values' => [
                            'userEnteredValue' => [
                                'stringValue' => $this->candidate->phone,
                            ],
                        ],
                    ],
                    'fields' => 'userEnteredValue',
                ],
            ]),
            new Request([
                'repeatCell' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'startRowIndex' => $lastInsertRow - 1,
                        'endRowIndex' => $lastInsertRow,
                        'startColumnIndex' => 0,
                        'endColumnIndex' => 24,
                    ],
                    'cell' => [
                        'userEnteredFormat' => [
                            'wrapStrategy' => 'CLIP',
                        ],
                    ],
                    'fields' => 'userEnteredFormat.wrapStrategy',
                ],
            ]),
        ];

        $dropDownColumns = [
            3 => strtolower($this->candidate->gender) == 'male' ? ['Male', 'Female'] : ['Female', 'Male'],
            4 => ['Choose', $settings->male_fees, $settings->female_fees],
            5 => ["Village Da'wah", "City Da'wah", "Office", "None"],
            13 => [$this->candidate->district, ...$settings->districts],
            18 => ["Attended", "Failed", "Pass"],
            19 => ["Not submitted", "Will be submitted after graduation", "Submitted & failed", "Submitted & passed"],
            20 => ["Not yet called", "Not available", "Not answered", "Answered but not coming", "Answered yes, coming"],
            21 => ["Not attended", "Attended but din't join iera", "Attended and joined iera"],
            22 => ["Choose", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            23 => ["Choose", "Southern Region", "Central Region", "Northern Region"],
            24 => ["Choose", "No", "Yes"],
        ];

        //Apply data validation to specific cells
        foreach ($dropDownColumns as $key => $dropdowns) {
            $validationRule = new DataValidationRule([
                'condition' => new BooleanCondition([
                    'type' => 'ONE_OF_LIST',
                    'values' => array_map(function ($value) {
                        return ['userEnteredValue' => $value];
                    }, $dropdowns),
                ]),
                'showCustomUi' => true,
                'strict' => true,
            ]);

            $requests[] = new Request([
                'updateCells' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'startRowIndex' => $lastInsertRow - 1,
                        'endRowIndex' => $lastInsertRow,
                        'startColumnIndex' => $key - 1,
                        'endColumnIndex' => $key,
                    ],
                    'rows' => [
                        'values' => [
                            'userEnteredValue' => [
                                'stringValue' => $dropdowns[0],
                            ],
                        ],
                    ],
                    'fields' => 'userEnteredValue',
                ],
            ]);

            $requests[] = new Request([
                'setDataValidation' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'startRowIndex' => $lastInsertRow - 1,
                        'endRowIndex' => $lastInsertRow,
                        'startColumnIndex' => $key - 1,
                        'endColumnIndex' => $key,
                    ],
                    'rule' => $validationRule,
                ],
            ]);
        }

        $batchUpdateRequest = new BatchUpdateSpreadsheetRequest([
            'requests' => $requests,
        ]);

        $sheetService->spreadsheets->batchUpdate($spreadsheetId, $batchUpdateRequest);
    }

    private function getSettings($sheetService)
    {
        $sheetService = $this->getSheetsService();
        $response = $sheetService->spreadsheets_values->get($this->candidate->venue->country->google_settings_id, "Sheet1!B2:C3");

        $values = $response->getValues();
        $data = [
            'male_fees' => '',
            'female_fees' => '',
            'districts' => [],
        ];

        if ($values) {
            foreach ($values as $key => $row) {
                switch ($key) {
                    case 0:
                        $data['male_fees'] = isset($row[0]) ? $row[0] : "Not set";
                        $data['districts'] = explode(",", isset($row[1]) ? $row[1] : "");
                        break;
                    default:
                        $data['female_fees'] = isset($row[0]) ? $row[0] : "Not set";
                        break;
                }
            }
        }

        return (object) $data;
    }

    public function createCandidateBucket($request)
    {
        $candidates = $this->getDriveService()->files->listFiles([
            'spaces' => 'drive',
            'q' => "'" . Venue::find($request->venue_id)->venueDrives()->first()->google_drive_id . "' in parents",
            'fields' => 'files(id)',
        ])->getFiles();

        $bucket = Bucket::create([
            'venue_id' => $request->venue_id,
            'candidate_no' => count($candidates) + 1
        ]);

        foreach (['id', 'cv', 'ph', 'ce'] as $docType) {
            if ($docType == 'ce') {
                for ($i = 1; $i <= $request->certificate_count; $i++) {
                    $bucket->addMediaFromRequest($docType . '' . $i)->usingName($docType)->usingFileName($bucket->candidate_no . '.jpg')->toMediaCollection($docType);
                }
            } else {
                $bucket->addMediaFromRequest($docType)->usingName($docType)->usingFileName($bucket->candidate_no . '.jpg')->toMediaCollection($docType);
            }
        }

        SaveDocumentManager::dispatch($bucket->id);

        return $bucket->candidate_no;
    }

    public function deleteVenue($google_drive_id, $google_workbook_id, $google_sheet_id)
    {
        $driveService = $this->getDriveService();
        $sheetService = $this->getSheetsService();

        $response = $sheetService->spreadsheets->get($google_workbook_id);
        $sheets = $response->getSheets();

        if (count($sheets) == 1) {
            $sheetRequest = new BatchUpdateSpreadsheetRequest([
                'requests' => [
                    [
                        'updateSheetProperties' => [
                            'properties' => [
                                'sheetId' => $google_sheet_id,
                                'title' => 'Sheet1'
                            ],
                            'fields' => 'title'
                        ]
                    ]
                ]
            ]);
        } else {
            $sheetRequest = new BatchUpdateSpreadsheetRequest([
                'requests' => [
                    [
                        'deleteSheet' => [
                            'sheetId' => $google_sheet_id,
                        ]
                    ]
                ]
            ]);
        }

        try {
            $driveService->files->delete($google_drive_id);
            $sheetService->spreadsheets->batchUpdate($google_workbook_id, $sheetRequest);
        } catch (Exception $e) {
            error_log('Error: ' . $e->getMessage());
        }
    }
}
