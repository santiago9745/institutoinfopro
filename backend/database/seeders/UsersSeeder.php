<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('users')->truncate();
        Schema::enableForeignKeyConstraints();

        User::create([
            'rol' => 1, // 1 = Director
            'name' => 'Admin',
            'apellido_paterno' => 'Principal',
            'apellido_materno' => 'Sistema',
            'ci' => '1234567',
            'expedido' => 'LP',
            'telefono_fijo' => '22112211',
            'celular' => '78945612',
            'email' => 'admin@jsonapi.com',
            'email_verified_at' => now(),
            'password' => 'secret',
            'remember_token' => Str::random(10),
        ]);
    }
}
