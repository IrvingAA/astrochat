import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AstroChat API</title>
        <style>
          /* General Reset */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e293b, #0f172a);
            color: #f1f5f9;
            overflow: hidden;
          }
          .container {
            text-align: center;
            position: relative;
            padding: 1rem;
          }
          h1 {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 1rem;
            background: -webkit-linear-gradient(45deg, #3b82f6, #93c5fd);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: slideIn 1.5s ease-out;
          }
          p {
            font-size: 1.2rem;
            color: #94a3b8;
            animation: fadeIn 2.5s ease-in-out;
          }
          .button {
            margin-top: 2rem;
            display: inline-block;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 500;
            color: #ffffff;
            background-color: #3b82f6;
            border: none;
            border-radius: 8px;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
          }
          .button:hover {
            background-color: #2563eb;
          }
          /* Animations */
          @keyframes slideIn {
            from {
              transform: translateY(-50px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 AstroChat <span>API</span></h1>
          <p>Bienvenido a la API de AstroChat, lista para tus aplicaciones.</p>
        </div>
      </body>
      </html>
    `
  }
}
/**
 *  /*  <a href="/api" class="button">Explora la API</a>
 */
