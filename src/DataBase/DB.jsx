const collation = {
  _: ' ',
  latin_ci_ai: ' COLLATE Latin1_General_CI_AI ',
  latin_ci_as: ' COLLATE Latin1_General_CI_AS ',
};

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
  where(whereStatements, additionalWhereStatements) {
    let queryString = '';
    let additionalString = '';
    if (additionalWhereStatements.length > 0) {
      additionalString = additionalWhereStatements.join(' AND ');
    }
    if (whereStatements?.length > 0) {
      const whereString = whereStatements
        .map((where, index) => {
          let whereString = '';
          if (Array.isArray(where.value) && !where.value.length) return null;
          if (typeof where.value === 'string' && !where.value.length)
            return null;
          if (Array.isArray(where.value)) {
            const baseSql = `(${where.discodataKey
              .split('.')
              .map((item) => '[' + item + ']')
              .join('.')}${collation[where.collation || '_']}LIKE '${
              where.isExact ? '' : '%'
            }:option${where.isExact ? '' : '%'}')`;
            return `(${where.value
              .map((option) => baseSql.replace(':option', option))
              .join(' OR ')})`;
          } else {
            whereString = `${where.discodataKey
              .split('.')
              .map((item) => '[' + item + ']')
              .join('.')}${collation[where.collation || '_']}LIKE '${
              where.regex && typeof where.regex === 'string'
                ? where.regex.replace(':value', where.value)
                : where.value
            }'`;
          }
          return whereString;
        })
        .filter((value) => value)
        .join(' AND ');
      if (whereString.length) {
        queryString += ` WHERE ${whereString}${
          additionalString ? ` AND ${additionalString}` : ''
        }`;
      } else if (additionalString.length > 0) {
        queryString += ` WHERE ${additionalString}`;
      }
    } else if (additionalWhereStatements.length > 0) {
      queryString += ` WHERE ${additionalString}`;
    }
    if (this.query.includes(':where')) {
      this.query = this.query.replace(
        ':where',
        queryString.replace(' WHERE ', ''),
      );
    } else {
      this.query += queryString;
    }
    return this;
  }
}

export default DB;
