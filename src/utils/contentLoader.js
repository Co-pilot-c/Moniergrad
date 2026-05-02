const parseMarkdownFile = (content) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, body: content };
  }

  const [, frontmatterStr, body] = match;
  const data = {};

  const lines = frontmatterStr.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    value = value.replace(/^["']|["']$/g, '');

    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    } else if (!isNaN(value) && value !== '') {
      value = Number(value);
    }

    data[key] = value;
  }

  return { data, body: body.trim() };
};

const parseListField = (yamlStr) => {
  const items = [];
  const itemRegex = /^\s*-\s+(.+)$/gm;
  let match;
  
  while ((match = itemRegex.exec(yamlStr)) !== null) {
    const itemStr = match[1];
    const item = {};
    
    const pairs = itemStr.split(/,\s*(?=\w+:)/);
    for (const pair of pairs) {
      const [key, val] = pair.split(':').map(s => s.trim());
      if (key && val) {
        let value = val.replace(/^["']|["']$/g, '');
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        item[key] = value;
      }
    }
    
    if (Object.keys(item).length > 0) {
      items.push(item);
    }
  }
  
  return items;
};

export const fetchContent = async (collection, activeOnly = true) => {
  try {
    const manifestResponse = await fetch(`/content/${collection}/manifest.json`);
    
    if (!manifestResponse.ok) {
      return [];
    }

    const manifest = await manifestResponse.json();
    const files = manifest.files || [];

    const items = [];

    for (const file of files) {
      const response = await fetch(`/content/${collection}/${file}`);
      if (!response.ok) continue;

      const content = await response.text();
      const { data, body } = parseMarkdownFile(content);

      if (activeOnly && data.active === false) {
        continue;
      }

      items.push({
        ...data,
        body,
        slug: file.replace('.md', ''),
      });
    }

    items.sort((a, b) => (a.order || 0) - (b.order || 0));

    return items;
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    return [];
  }
};

export const fetchSettings = async () => {
  try {
    const response = await fetch('/content/settings/site.json');
    if (!response.ok) {
      return {};
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
};

export const fetchNavigation = async () => {
  try {
    const response = await fetch('/content/settings/navigation.json');
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.menu_items || [];
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return [];
  }
};
