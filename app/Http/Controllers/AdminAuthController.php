<?php

namespace App\Http\Controllers;


use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    public function signup(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'password' => 'required|string|min:6',
        ]);
        $admin = Admin::create([
            'name' => $data['name'],
            'password' => bcrypt($data['password']),

        ]);

        $token = $admin->createToken('admin')->plainTextToken;

        return response([
            'admin' => $admin,
            'token' => $token
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'name' => 'required|string',
            'password' => 'required|string',
            'remember' => 'boolean'
        ]);
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if (!Auth::guard('admin')->attempt($credentials, $remember)) {
            return response([
                'error' => 'The provided credentials are not correct'
            ], 422);
        }

        $admin = Auth::guard('admin')->user();
        $token = $admin->createToken('admin')->plainTextToken;

        return response([
            'admin' => $admin,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response([
            'success' => true
        ]);
    }

    public function me(Request $request)
    {
        return $request->user();
    }
}
