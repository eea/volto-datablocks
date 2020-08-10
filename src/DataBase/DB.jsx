class DB {
  static table(query, path = '', pagination = {}) {
    return new Table(query, path, pagination);
  }
}

class Table {
  constructor(query, path, pagination) {
    this.query = query;
    this.path = path || '/';
    this.pagination = pagination || {};
  }
  get() {
    const { p, nrOfHits } = this.pagination;
    return `${this.path}?query=${this.query}${
      typeof p !== 'undefined' ? '&p=' + p : ''
    }${typeof nrOfHits !== 'undefined' ? '&nrOfHits=' + nrOfHits : ''}`;
  }
  encode() {
    this.query = encodeURI(this.query);
    return this;
  }
  where(whereStatements) {
    this.query +=
      whereStatements?.length > 0
        ? whereStatements
            .map(where => {
              return ` WHERE [${where.discodataKey}] LIKE '${where.value}'`;
            })
            .join(' AND ')
        : '';
    return this;
  }
}

export default DB;
