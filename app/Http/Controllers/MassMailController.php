<?php

namespace App\Http\Controllers;

use App\Models\ContactInfo;
use App\Models\Subscriber;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MassMailController extends Controller
{
    /**
     * Envía el correo con contenido React renderizado a todos los contactos
     */
    public function sendMassReactEmail(Request $request)
    {


        // Obtener el HTML renderizado y el asunto
        $htmlContent = $request->input('html');


        // Obtener solo los correos de contactos activos (active = 1)
        $contacts = Subscriber::where('active', 1)->pluck('email')->toArray();

        // Verificar si hay correos para enviar
        if (empty($contacts)) {
            return response()->json([
                'status' => 'error',
                'message' => 'No hay contactos disponibles para enviar correos'
            ], 404);
        }

        // Contador de correos enviados
        $sentCount = 0;
        $failedCount = 0;

        // Enviar el correo a cada contacto
        foreach ($contacts as $email) {
            try {
                Mail::send([], [], function ($message) use ($htmlContent, $email) {
                    $message->to($email)
                        ->subject("Newsletter")
                        ->html($htmlContent);
                });
                $sentCount++;
            } catch (\Exception $e) {
                Log::error("Error al enviar correo a {$email}: " . $e->getMessage());
                $failedCount++;
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => "Correo enviado con éxito a {$sentCount} contactos",
            'failed' => $failedCount,
            'total' => count($contacts)
        ]);
    }
}
