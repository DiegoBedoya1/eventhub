<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\Concerns\Has;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Datos incorrectos'], 401);
        }

        // Generamos el token de Sanctum
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function register(Request $request)
    {
        // validacion
        $request->validate([
            'full_name'=>'required|string|max:255',
            'email'=>'required|string|email|max:255|unique:users', #email no debe estar repetido en el modelo User tabla users
            'full_name'=>'required|string|min:8', 
        ]);

        // crear en la bd
        $user = User::create([
            'full_name'=> $request->full_name,
            'email'=> $request->email,
            'password'=> Hash::make($request->password),
        ]);

        // asignar token
        $token = $user->createToken('auth_token')->plainTextToken;

        // respoonder usario y token
        return response()->json([
            'user'=> $user,
            'token'=>$token,
        ],201); // 201 = exito
    }

}
