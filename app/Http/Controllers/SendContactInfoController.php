<?php

namespace App\Http\Controllers;

use App\Models\ContactInfo;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class SendContactInfoController extends Controller
{
    public function sendReactEmail(Request $request)
    {
        $htmlContent = $request->input('html'); // Recibe el HTML renderizado
        $contactInfo = ContactInfo::first()->mail;

        Mail::send([], [], function ($message) use ($htmlContent, $contactInfo) {
            $message->to($contactInfo)
                ->subject('Correo de Contacto')
                ->html($htmlContent);
        });

        return response()->json(['message' => 'Correo enviado con éxito']);
    }
}
