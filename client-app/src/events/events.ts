interface Channels {
  [key: string]: Subscribers;
}

interface Subscribers{
  [key: string]: (message: string, payload?: any) => void;
}

const channels: Channels = {};

function getChanel(key: string) {
  if (channels[key] === undefined) {
    channels[key] = {};
  }

  return channels[key];
}

export function Subscribe(
  channel: string,
  id: string,
  func: (message: string, payload?: any) => void
) {
  getChanel(channel)[id] = func;
}

export function UnSubscribe(channel: string, id: string) {
  delete getChanel(channel)[id];
}

export function Publish(channel: string, message: string, payload?: any) {
  const ch = getChanel(channel);

  for (const key in ch) {
    if (ch.hasOwnProperty(key)) {
      ch[key](message, payload);
    }
  }
}