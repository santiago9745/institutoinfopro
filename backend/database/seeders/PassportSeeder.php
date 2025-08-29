<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Laravel\Passport\ClientRepository;
use Illuminate\Support\Facades\DB;

class PassportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('oauth_clients')->truncate(); // Borra y reinicia los IDs

        $clientRepo = app(ClientRepository::class);

        // 1️⃣ Crear primero el Personal Access Client (ID = 1)
        $clientRepo->createPersonalAccessClient(
            null, 'Personal Access Client', config('app.url') . '/callback'
        );

        // 2️⃣ Ahora el Password Grant Client (ID = 2)
        $client = $clientRepo->createPasswordGrantClient(
            null, 'Password Grant Client', config('app.url') . '/callback'
        );

        // ✅ Mostrar o guardar los datos para tu .env
        $this->command->info("Client ID: {$client->id}");
        $this->command->info("Client Secret: {$client->secret}");
    }
}
