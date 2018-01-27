// libs
const { validatePagination } = require('../lib/common');

module.exports = (model) => {
  const retrieve = id => (
    model.findById(id)

    .then(item => (!item ? Promise.reject({
      statusCode: 404,
      code: 'Not found.',
    }) : item.getInfo()), () => (
      Promise.reject({
        statusCode: 500,
        code: 'Error while retrieving object.',
      })
    ))
  );

  const create = body => (
    model.createMap(body)

    .then(createBody => (
      model.create(createBody)

      .then(item => (
        Promise.resolve(item.getInfo())
      ))

      .catch(() => (
        Promise.reject({
          statusCode: 500,
          code: 'Error while saving object.',
        })
      ))
    ))
  );

  const update = (id, body) => {
    model.updateMap(body)

      .then(updateBody => (
        model.findOneAndUpdate({ _id: id }, updateBody)

        .then(item => (!item ? Promise.reject({
          statusCode: 404,
          code: 'Not found.',
        }) : retrieve(item.id)))

        .catch(() => (
          Promise.reject({
            statusCode: 500,
            code: 'Error while updating object.',
          })
        ))
      ));
  };

  const search = query => (
    validatePagination(query)

    .then(({ skip, limit }) => {
      console.log('SKIP at crud >>> ', skip);
      console.log('limit at crud >>>', limit);
      console.log('query at crud >>>', query);
      const sortObj = { created: -1 };
      if (query.sortBy && (query.sortBy === 'found_date' || query.sortBy === 'Reward')) {
        delete sortObj.created;
        sortObj[query.sortBy] = query.sortOder === 'asc' ? 1 : -1;
      }
      console.log('query at crud >>>', sortObj);
      const searchRequest = (type) => {
        const dbQuery = model[type]({
          $and: (query.searchTerms || ' ').trim().split(' ').map(term => ({
            search: {
              $regex: term,
              $options: 'i',
            },
          })).concat(model.extraFields(query)),
        });
        return (type !== 'count' ? dbQuery.limit(limit).skip(skip) : dbQuery)
          .sort(sortObj)
          .exec();
      };

      return Promise.all([searchRequest('find'), searchRequest('count')])

        .then(([items, hits]) => (
          Promise.all(items.map(item => (
            Promise.resolve(item.getInfo())
          )))

          .then(results => (
            Promise.resolve({
              results,
              hits,
            })
          ))
        ))

        .catch(() => (
          Promise.reject({
            statusCode: 500,
            code: 'Internal server error.',
          })
        ));
    })
  );

  const deleteItem = id => (
    retrieve(id)

    .then(() => (
      model.remove({ _id: id })

      .catch(() => (
        Promise.reject({
          statusCode: 500,
          code: 'Error while deleting object.',
        })
      ))
    ))
  );

  return {
    create,
    retrieve,
    update,
    deleteItem,
    search,
  };
};
