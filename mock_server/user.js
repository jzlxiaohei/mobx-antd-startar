module.exports = function (app) {

  app.get('/api/users', function (req, res) {
    res.json({
      total: 100,
      currentPage: 2,
      users: [
        {
          id: '1',
          name: 'lls',
          avatar: 'http://cdn.llsapp.com/shared/lls-logo.png'
        },
        {
          id: 2,
          name: 'godpig',
          avatar: 'https://avatars0.githubusercontent.com/u/1884248'
        }
      ]
    })
  });

  app.delete('/api/users/:id', function (req, res) {
    res.json({
      id: req.params.id
    })
  })

  app.post('/api/users', function (req, res) {
    res.json({
      id: '9',
      name: 'jzl',
      avatar: 'https://avatars0.githubusercontent.com/u/1884248'
    })
  })
};