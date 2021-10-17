const Cache = require('@11ty/eleventy-cache-assets')

const blogFromCmsDesarol = (b) => {
  return {
    title: b.attributes.title,
    body: b.attributes.body?.value,
    path: b.attributes.path?.alias,
  }
}

const blogs = async () => {
  const data = []

  let next = 'https://cms.desarol.com/jsonapi/node/blog?filter[field_author.id]=8675eb72-5125-4369-aa14-b53b20e6b0a5'
  while (next) {
    const r = await Cache(next, { duration: '1d', type: 'json' })
    data.push(...r.data.map(b => blogFromCmsDesarol(b)))
    next = r?.links?.next
  }

  return data
}

module.exports = blogs()