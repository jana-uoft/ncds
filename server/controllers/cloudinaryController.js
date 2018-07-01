const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./.env.json', 'utf8'));

cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});


export async function list(req, res, next) {
  let result = await cloudinary.api.resources({ max_results: 500, tags: true });
  while (result.hasOwnProperty('next_cursor') && result.next_cursor){
    const nextResult = await cloudinary.api.resources({ max_results: 500, tags: true, next_cursor: result.next_cursor });
    result.next_cursor = nextResult.next_cursor ? nextResult.next_cursor : null;
    result.rate_limit_allowed = nextResult.rate_limit_allowed;
    result.rate_limit_reset_at = nextResult.rate_limit_reset_at;
    result.rate_limit_remaining = nextResult.rate_limit_remaining;
    result.resources = [...result.resources, ...nextResult.resources];
  }
  return res.status(200).json(result);
}

export async function update(req, res, next) {
  const { public_id, tags } = req.body;
  const resource = await cloudinary.api.update(public_id, {tags: tags});
  return res.status(200).json(resource);
}

export async function remove(req, res, next) {
  const { tag } = req.body;
  const resources = await cloudinary.api.delete_resources_by_tag(tag);
  return res.status(200).json(resources);
}

export async function create(req, res, next) {
  const { images } = req.body;
  let uploadedImages = [];
  for (let {file, tags} of images){
    uploadedImages.push(await cloudinary.uploader.upload(file, {tags: tags}))
  }
  return res.status(200).json(uploadedImages);
}