/**
 * Scrapes a section element for data needing to be handled in section JS
 *
 * @param {DOMNode} container
 * @returns parsed JSON
 */
window.scrapeSectionData = (container) => {
  const dataEl = container.parentNode.querySelector('[data-section-data]');
  if (!dataEl) return {};

  try {
    return JSON.parse(dataEl.textContent);
  } catch {
    console.warn(
      `Error parsing data for ${container.dataset.sectionType} ${container.dataset.sectionId}`,
    );
    return {};
  }
};

/**
 * Fetchs page data from alternate templates
 *
 * @param {String} path
 * @param {String} templateSuffix
 * @returns parsed JSON
 */
window.fetchPageData = async ({ path, options = {} }) => {
  if (!path || options === {}) return {};

  const { templateSuffix, sectionId, variantId } = options;
  const queryArray = [];

  if (templateSuffix) queryArray.push(`view=${templateSuffix}`);
  if (sectionId) queryArray.push(`section_id=${sectionId}`);
  if (variantId) queryArray.push(`variant=${variantId}`);

  const url = `${path}?${queryArray.join('&')}`;
  let html = {};

  await fetch(url)
    .then((response) => response.text())
    .then((response) => {
      const elId = sectionId ? `shopify-section-${sectionId}` : 'MainContent';
      html = new DOMParser().parseFromString(response, 'text/html');
      html = html.getElementById(elId).innerHTML;
    })
    .catch(() => {
      console.warn(`Error fetching data from ${url}`);
    });

  return html;
};

/**
 * Base-64 encodes an ID
 *
 * @param {String} id resource ID
 * @param {String} type resource type
 * @returns encoded ID
 */
window.encodeId = (id, type) => {
  return `gid://shopify/${type}/${id}`;
};

/**
 * Decode Storefront Product ID, this is used
 * with Storefront API
 *
 * @param {String} id resource ID
 * @param {String} type resource type
 * @returns decoded ID
 */
window.decodeId = (id, type) => {
  return parseInt(id.split(`gid://shopify/${type}/`)[1], 10);
};

/**
 * Makes product data more consumable
 * @param {Array} data array of product objects
 */

window.formatProducts = (data) => {
  return data.map((product) => {
    return formatProduct(product.node);
  });
};

/**
 * Makes product data more consumable
 * @param {Object} data product object
 */
window.formatProduct = (data) => {
  const variants = formatVariants(data.variants);
  const badges = data?.product_badges?.value?.replace(/\\/g, '');
  let props = data?.props?.value?.replace(/[\[\]\"']+/g, '');
  if (props) {
    props = props.includes(',') ? props.split(',') : props.split();
  }
  let breadcrumbs_copy = data?.breadcrumbs_copy?.value?.replace(
    /[\[\]\"']+/g,
    '',
  );
  if (breadcrumbs_copy) {
    breadcrumbs_copy = breadcrumbs_copy.includes(',')
      ? breadcrumbs_copy.split(',')
      : breadcrumbs_copy.split();
  }
  let breadcrumbs_link = data?.breadcrumbs_link?.value?.replace(
    /[\[\]\"']+/g,
    '',
  );
  if (breadcrumbs_link) {
    breadcrumbs_link = breadcrumbs_link.includes(',')
      ? breadcrumbs_link.split(',')
      : breadcrumbs_link.split();
  }
  const product_hover_image = data.product_hover_image
    ? data.product_hover_image.reference.image.originalSrc
    : null;

  return {
    ...data,
    title: data.title.split('|')[0],
    color: data.title.split('|')[1],
    id: decodeId(data?.id, 'Product'),
    images: data?.images?.edges.map((edge) => edge.node),
    media: data?.media?.edges.map((edge) => edge.node),
    selectedOptions: data?.selectedOptions?.edges.map((edge) => edge.node),
    product_badges: badges,
    variants: variants,
    props: props || null,
    breadcrumbs_copy: breadcrumbs_copy || null,
    breadcrumbs_link: breadcrumbs_link || null,
    product_hover_image,
  };
};

/**
 * Makes variant data more consumable
 * @param {Array} data array of variant objects
 */
window.formatVariants = (data) => {
  const variants = data.edges.map((variant) => formatVariant(variant.node));
  return variants;
};


/**
 * Makes variant data more consumable
 * @param {Object} data variant object
 */
window.formatVariant = (data) => {
  return {
    ...data,
    id: decodeId(data.id, 'ProductVariant'),
    options: data.selectedOptions.map(item => item.value)
  };
};

/**
 * Validates email address
 * @param {String} data email
 */
window.isValidEmail = (email) =>
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );
