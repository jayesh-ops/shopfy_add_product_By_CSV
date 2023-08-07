// Import required modules
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csvParser = require('csv-parser');

// Shopify API credentials
const shopifyStoreUrl = 'https://035e84.myshopify.com/';
const apiKey = 'ec88be98cf1284e6bf7d38c3c0bcf4f9';
const password = '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';

// Function to add a product to Shopify
async function addProductToShopify(productData) {
  try {
    const response = await axios({
      method: 'POST',
      url: `${shopifyStoreUrl}/admin/api/2023-04/products.json`,
      auth: {
        username: apiKey,
        password: password,
      },
      data: {
        product: productData,
      },
    });

    console.log('Product added:', response.data.product.title);
  } catch (error) {
    console.error('Error adding product:', error.message);
  }
}

// Read and parse CSV file
const csvFilePath = path.join(__dirname, 'products.csv');
fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on('data', (row) => {
    // Create product data object
    const productData = {
      title: row.title,
      body_html: row.description,
      images: [
        {
          src: row.image_url,
        },
      ],
    };

    // Add the product to Shopify
    addProductToShopify(productData);
  })
  .on('end', () => {
    console.log('CSV file processing complete.');
  });
