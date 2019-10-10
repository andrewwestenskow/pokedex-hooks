import Fuse from 'fuse.js'

const filterList = (list, search) => {
  const options = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name']
  };
  const fuse = new Fuse(list, options);
  const result = fuse.search(search);
  return result.splice(0,9)
}

export default filterList