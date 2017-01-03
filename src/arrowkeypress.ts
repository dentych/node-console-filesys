import {EventEmitter} from "events";
import ReadableStream = NodeJS.ReadableStream;

export default function (stream: ReadableStream): ArrowKeyEmitter {
    stream.on("data", onData);

    return emitter;
}

class ArrowKeyEmitter extends EventEmitter {
}

const emitter = new ArrowKeyEmitter();

function onData(data: Buffer) {
    if (data.length == 1) {
        switch(data[0]) {
            case 0x0d:
                // emit("enter");
                break;
            case 0x7f:
                emit("backspace");
                break;
        }
    } else if (data.length == 3) {
        let lastIndex = data.length - 1;
        switch (data[lastIndex]) {
            case 0x41: // up
                emit("up");
                break;
            case 0x42: // down
                emit("down");
                break;
            case 0x43: // right
                emit("right");
                break;
            case 0x44: // left
                emit("left");
                break;
        }
    }
}

function emit(direction: string) {
    emitter.emit("keypress", direction);
}