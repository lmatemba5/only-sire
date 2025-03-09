<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StoreRequest;
use App\Http\Requests\Users\UpdateRequest;
use App\Http\Resources\Users\UserResource;
use Illuminate\Support\Str;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $users = User::with('country', 'roles')->where([
            'country_id' => $request->user()->country_id
        ])->paginate(20);

        return UserResource::collection($users);
    }

    public function show(User $user): UserResource
    {
        return new UserResource($user);
    }

    public function store(StoreRequest $request): UserResource
    {
        $user = User::create([
            ...$request->only('email', 'name'),
            'country_id' => $request->user()->country_id,
            'remember_token' => Str::random(10)
        ]);
        
        $user->syncRoles([$request->role]);
        $user->refresh();
        
        return new UserResource($user);
    }

    public function update(UpdateRequest $request , User $user): JsonResponse
    {
        $user->update($request->validated());
        $user->syncRoles([$request->role]);
        return new JsonResponse();
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();
        return new JsonResponse();
    }
    
    public function create(Request $request)
    {
        return view('pages.country-admin.officers', [
            'data' => [
                'activeTab' => 'users',
                ...$this->data(),
                'roles' => Role::select('id', 'name')->paginate(),
                'users' => User::where([
                    ...($request->user()->email == email() ? [['country_id', '!=', null]]: ['country_id' => $request->user()->country_id])
                ])->join('countries', 'users.country_id', 'countries.id')
                ->join('model_has_roles', 'users.id', 'model_has_roles.model_id')
                ->join('roles', 'roles.id', 'model_has_roles.role_id')
                ->where('users.id', '!=', $request->user()->id)->select([
                    'users.id',
                    'users.name',
                    'users.email',
                    'users.avatar',
                    'countries.name as country',
                    'users.isLocked',
                    'roles.name as role',
                ])->paginate(20),
            ],
        ]);
    }
}
