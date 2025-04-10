export abstract class Entity<T> {
  protected readonly _id: string;
  protected props: T;

  constructor(props: T, id?: string) {
    this._id = id || Math.random().toString(36).substr(2, 9);
    this.props = props;
  }

  get id(): string {
    return this._id;
  }
} 