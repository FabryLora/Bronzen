<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserAuthController extends Controller
{

    public function index()
    {
        return UserResource::collection(User::all());
    }

    public function allUsers()
    {
        return UserResource::collection(User::select('id', 'name')->get());
    }

    public function showUser(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }

        return new UserResource($user);
    }


    public function signup(Request $request)
    {
        $data = $request->validate([
            'name' => "required|string|max:255",
            'email' => "required|string|email|max:255|unique:users,email",
            "password" => "required|confirmed|string|min:8",
            'cuit' => 'required|string|max:20',
            'direccion' => 'nullable|string|max:255',
            'provincia' => 'nullable|string|max:255',
            'localidad' => 'nullable|string|max:255',
            'descuento_general' => 'nullable|integer',
            'descuento_adicional' => 'nullable|integer',
            'descuento_adicional_2' => 'nullable|integer',
            'tipo' => 'nullable|string',
            'autorizado' => 'nullable|boolean'
        ]);


        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'cuit' => $data['cuit'],
            'direccion' => $data['direccion'],
            'provincia' => $data['provincia'],
            'localidad' => $data['localidad'],
            'descuento_general' => $data['descuento_general'],
            'descuento_adicional' => $data['descuento_adicional'],
            'autorizado' => $data['autorizado'],
            'descuento_adicional_2' => $data['descuento_adicional_2'],
            'tipo' => $data['tipo'] ?? 'cliente',

        ]);
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function login(Request $request)
    {

        $credentials = $request->validate([
            'name' => "required|string|max:255",
            "password" => "required",
            'remember' => 'boolean',
        ]);
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if (!Auth::attempt($credentials, $remember)) {
            return response([
                'error' => 'Las credenciales no son correctas'
            ], 422);
        }

        $user = Auth::user();


        if (!$user->autorizado) {
            Auth::logout();
            return response([
                'error' => 'Tu cuenta no esta autorizada'
            ], 403);
        }

        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {

        $user = Auth::user();
        $user->currentAccessToken()->delete();

        return response([
            'success' => true
        ]);
    }

    public function me(Request $request)
    {
        return $request->user();
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $id,
            'cuit' => 'sometimes|string|max:20',
            'direccion' => 'sometimes|string|max:255',
            'provincia' => 'sometimes|string|max:255',
            'localidad' => 'sometimes|string|max:255',
            'password' => 'sometimes|string|min:6|confirmed',
            'lista' => 'sometimes|string|max:255',
            'autorizado' => 'sometimes|boolean',
            'descuento_general' => 'sometimes|integer',
            'descuento_adicional' => 'sometimes|integer',
            'descuento_adicional_2' => 'sometimes|integer',
            'tipo' => 'sometimes|string',
        ]);

        // Solo actualiza la contraseña si se proporciona
        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']); // Elimina el campo para no sobrescribirlo
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => new UserResource($user)
        ], 200);
    }



    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ], 200);
    }
}
