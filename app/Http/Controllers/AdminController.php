<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginAdminRequest;
use Illuminate\Http\Request;

use App\Http\Requests\SignupAdminRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{

    public function index(Request $request)
    {
        return AdminResource::collection(Admin::all());
    }


    public function show(Request $request, $id)
    {
        return response()->json(Admin::find($id));
    }



    public function update(Request $request, $id)
    {
        // Buscar el administrador por ID
        $admin = Admin::find($id);

        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }

        // Validar los datos de la solicitud
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed', // Si se proporciona, se valida como mínimo 8 caracteres
        ]);

        // Actualizar los campos que han sido validados
        if (isset($validated['name'])) {
            $admin->name = $validated['name'];
        }

        if (isset($validated['password'])) {
            $admin->password = bcrypt($validated['password']);
        }

        // Guardar los cambios
        $admin->save();

        // Retornar la respuesta con el administrador actualizado
        return response()->json([
            'message' => 'Admin updated successfully',
            'user' => $admin
        ]);
    }

    public function destroy($id)
    {
        // Verifica si el admin está autenticado usando el guard 'admin'

        // Verifica si el admin a eliminar existe
        $adminToDelete = Admin::find($id);
        if (!$adminToDelete) {
            return response()->json(['error' => 'Admin not found'], 404);
        }

        // Elimina el admin
        $adminToDelete->delete();

        return response()->json(['message' => 'Admin deleted successfully'], 200);
    }
}
