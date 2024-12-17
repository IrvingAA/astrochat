import { Controller, Get } from '@nestjs/common'

@Controller()
export class NotFoundController {
  @Get()
  notFoundPage(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>404 - Not Found</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            background-color: #1a202c;
            color: #ffffff;
          }
          h1 {
            font-size: 3rem;
            text-align: center;
          }
          p {
            color: #cbd5e0;
          }
          span {
            color: #e53e3e;
          }
        </style>
      </head>
      <body>
        <div>
          <h1><span>404</span> - Página No Encontrada</h1>
          <p>Lo sentimos, pero la ruta que intentas acceder no existe.</p>
        </div>
      </body>
      </html>
    `
  }
}
