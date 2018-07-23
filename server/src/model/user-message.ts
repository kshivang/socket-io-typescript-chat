import {  User } from '.';
import { MessageContent } from './message-content';

export class UserMessage {
    constructor(public from: User, public content: MessageContent) {}
}