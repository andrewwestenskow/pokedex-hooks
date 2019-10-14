insert into pokemon(name, sort_order, height, weight, id, base_experience, url, species_url)
values(${name}, ${sort_order}, ${height}, ${weight}, ${id}, ${base_experience}, ${url}, ${species_url})
returning *