<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UsuarioRegistrado extends Mailable
{
    use Queueable, SerializesModels;

    public $usuario;
    public $passwordPlano;
    /**
     * Create a new message instance.
     */
    public function __construct($usuario, $passwordPlano)
    {
        $this->usuario = $usuario;
        $this->passwordPlano = $passwordPlano;
    }

    public function build()
    {
        return $this->subject('Bienvenido a la plataforma')
                    ->view('emails.usuario_registrado');
    }
}
