import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as robot from 'robotjs';

import { UserMessage, MessageContent } from './model';

export class ControllerServer {
    public static readonly PORT:number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ControllerServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (message: any) => {
                const m = JSON.parse(message)
                console.log('[server](message): %s', message);
                
                const content = m['content']
                if (content && content.type && content.message) {
                    switch (content['type'])  {
                        case '0': {
                            this.mouseSine()
                            break;
                        }
                        case '1': {
                            switch (content["message"]) {
                                case 'UP':  {
                                    this.mouseNavigation(0, -1)
                                    break;
                                }
                                case 'DOWN': {
                                    this.mouseNavigation(0, 1)
                                    break;
                                }
                                case 'RIGHT': {
                                    this.mouseNavigation(1, 0)
                                    break;
                                }
                                case 'LEFT': {
                                    this.mouseNavigation(-1, 0)
                                    break;
                                }
                                default: {
                                    console.log("Not defined")
                                }
                            }
                            break
                        }
                        default: {
                            console.log("Not defined")
                        }
                    }
                }
                this.io.emit('message', message);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    private mouseSine(): void {
        robot.setMouseDelay(2);

        const twoPI = Math.PI * 2.0;
        const screenSize = robot.getScreenSize();
        const height = (screenSize.height / 2) - 10;
        const width = screenSize.width;

        for (var x = 0, y = 0; x < width; x++)
        {
            y = height * Math.sin((twoPI * x) / width) + height;
            robot.moveMouse(x, y);
        }
    }

    private mouseNavigation(right: number, down: number): void {
        robot.setMouseDelay(2);
        const screenSize = robot.getScreenSize();
        const current = robot.getMousePos();
        console.log(current)
        robot.moveMouse(current.x + (10 * right), current.y + (10 * down))
    }

    public getApp(): express.Application {
        return this.app;
    }
}
