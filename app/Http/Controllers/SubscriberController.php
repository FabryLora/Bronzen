<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubscriberResource;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubscriberController extends Controller
{
    public function index()
    {
        return SubscriberResource::collection(Subscriber::all());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:subscribers,email',
            'active' => 'sometimes|boolean',
            'name' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $subscriber = Subscriber::create([
            'email' => $request->email,
            'name' => $request->name,
            'company' => $request->company,
            'active' => true,
        ]);

        return response()->json($subscriber, 201);
    }

    public function show($id)
    {
        $subscriber = Subscriber::findOrFail($id);
        return response()->json($subscriber);
    }

    public function update(Request $request, $id)
    {
        $subscriber = Subscriber::findOrFail($id);

        $validator = Validator::make($request->all(), [

            'active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $subscriber->update($request->all());
        return response()->json($subscriber);
    }
}
