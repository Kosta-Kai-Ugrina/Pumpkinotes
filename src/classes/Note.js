export class Note {
  constructor(key, title, lineArray) {
    this.key = key;
    this.title = title;
    this.lineArray = lineArray;
  }

  serialize = () => JSON.stringify(this);

  static deserialize = (dataString) => {
    const dataObject = JSON.parse(dataString);
    return new Note(dataObject.key, dataObject.title, dataObject.lineArray);
  };
}
