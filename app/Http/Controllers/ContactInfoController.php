<?php

namespace App\Http\Controllers;

use App\Models\ContactInfo;
use Illuminate\Http\Request;
use App\Http\Resources\ContactInfoResource;

class ContactInfoController extends Controller
{

    public function index()
    {

        return new ContactInfoResource(ContactInfo::first());
    }


    public function show(ContactInfo $contactInfo)
    {
        return new ContactInfoResource($contactInfo);
    }


    public function update(Request $request, $id)
    {

        $contactInfo = ContactInfo::find($id);
        $data = $request->validate([
            'mail' => "email|nullable",
            'phone' => "nullable|string",
            'second_phone' => "nullable|string",
            'wp' => "nullable|string",

        ]);
        $contactInfo->update($data);
    }
}
