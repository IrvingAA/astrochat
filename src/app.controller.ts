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
          span {
            color: #3182ce;
          }
        </style>
      </head>
      <body>
        <h1><span>AstroChat</span> API</h1>
      </body>
      </html>
    `
  }
}
