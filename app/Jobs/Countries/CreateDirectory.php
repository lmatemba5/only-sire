<?php

namespace App\Jobs\Countries;

use App\Jobs\QueueJob;
use App\Models\Country;
use App\Providers\GoogleService;
use Google\Service\Sheets\Request;
use Google\Service\Drive\DriveFile;
use Google\Service\Sheets\ValueRange;
use Google\Service\Sheets\BatchUpdateSpreadsheetRequest;

class CreateDirectory extends QueueJob
{
    /**
     * Create a new job instance.
     */
    public function __construct(protected int $country_id)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $country = Country::find($this->country_id);

        $gac = new GoogleService();
        $driveService = $gac->getDriveService();
        $sheetService = $gac->getSheetsService();

        $cdfs = $driveService->files->listFiles([
            'spaces' => 'drive',
            'q' => "name='" . $country->name . "' and '" . config('services.google.folder_id') . "' in parents",
            'fields' => 'files(id)',
        ])->getFiles();

        if (count($cdfs) == 0) {
            $cdf = $driveService->files->create(
                new DriveFile([
                    'name' => $country->name,
                    'mimeType' => 'application/vnd.google-apps.folder',
                    'parents' => [config('services.google.folder_id')],
                ]),
                [
                    'fields' => 'id',
                ]
            );
        } else {
            $cdf = $cdfs[0];
        }

        $sdfs = $driveService->files->listFiles([
            'spaces' => 'drive',
            'q' => "name='Settings' and '" . $cdf->id . "' in parents",
            'fields' => 'files(id)',
        ])->getFiles();

        if (count($sdfs) == 0) {
            $sdf = $driveService->files->create(
                new DriveFile([
                    'name' => "Settings",
                    'mimeType' => 'application/vnd.google-apps.spreadsheet',
                    'parents' => [$cdf->id],
                ]),
                [
                    'fields' => 'id',
                ]
            );

            $values = [
                ["", "Fees", "Districts"],
                ["Male", $country->name == 'Malawi' ? "150,000" :"", $country->name == 'Malawi' ? "Mangochi, Machinga, Balaka, Nkhotakota, Mzimba, Lilongwe, Ntchisi, Mchinji, Ntcheu, Salima, Neno, Mwanza, Blantyre, Chiradzulo, Phalombe, Mulanje, Thyolo, Nsanje, Chikwawa, Dedza, Kasungu,Likoma,Dowa,Karonga,Rumphi, Chitipa, Nkhata Bay,Zomba" : ""],
                ["Female", $country->name == 'Malawi' ? "130,000" : "", ""]
            ];

            $body = new ValueRange([
                'values' => $values,
            ]);

            $params = [
                'valueInputOption' => 'USER_ENTERED',
            ];

            $sheetService->spreadsheets_values->append(
                $sdf->id,
                "Sheet1!A:C",
                $body,
                $params
            );

            $requests = [
                new Request([
                    'repeatCell' => [
                        'range' => [
                            'sheetId' => 0,
                            'startRowIndex' => 0,
                            'endRowIndex' => 1,
                            'startColumnIndex' => 0,
                            'endColumnIndex' => 3,
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
                    ]
                ]),
                new Request([
                    'repeatCell' => [
                        'range' => [
                            'sheetId' => 0,
                            'startRowIndex' => 1,
                            'endRowIndex' => 3,
                            'startColumnIndex' => 0,
                            'endColumnIndex' => 1,
                        ],
                        'cell' => [
                            'userEnteredFormat' => [
                                'backgroundColor' => [
                                    "red" => 0 / 255,
                                    "green" => 0 / 255,
                                    "blue" => 139 / 255,
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
                    ]
                ]),

                new Request([
                    'repeatCell' => [
                        'range' => [
                            'sheetId' => 0,
                            'startRowIndex' => 1,
                            'endRowIndex' => 2,
                            'startColumnIndex' => 2,
                            'endColumnIndex' => 3,
                        ],
                        'cell' => [
                            'userEnteredFormat' => [
                                'wrapStrategy' => 'CLIP'
                            ]
                        ],
                        'fields' => 'userEnteredFormat.wrapStrategy',
                    ]
                ]),
            ];

            $sheetService->spreadsheets->batchUpdate($sdf->id,  new BatchUpdateSpreadsheetRequest([
                'requests' => $requests,
            ]));
        } else {
            $sdf = $sdfs[0];
        }


        $country->update([
            'google_drive_id' => $cdf->id,
            'google_settings_id' =>  $sdf->id
        ]);
    }
}