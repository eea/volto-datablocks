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
    let queryString =
      whereStatements?.length > 0
        ? whereStatements
            .map(where => {
              let whereString = '';
              if (Array.isArray(where.value)) {
                return ` WHERE [${where.discodataKey}] IN (${where.value.map(
                  v => {
                    return "'" + v + "'";
                  },
                )})`;
              } else {
                whereString = ` WHERE [${where.discodataKey}] LIKE '${
                  where.value
                }'`;
              }
              return whereString;
            })
            .join(' AND ')
        : '';
    if (this.query.includes(':where')) {
      this.query = this.query.replace(':where', queryString);
    } else {
      this.query += queryString;
    }
    return this;
  }
}

export default DB;
