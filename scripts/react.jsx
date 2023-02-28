import { ApolloProvider, useQuery, gql } from "@apollo/client";
import React, { useEffect, useState, useRef, useMemo } from 'react';
import client from "../components/global/apolloClient";
import * as queries from "../components/global/queries";
import ReactDOM from "react-dom/client";
import { addItem } from '@shopify/theme-cart';


function RadioGroup({ options, selected, onChange }) {
  const handleLabelClick = (event) => {
    const label = event.currentTarget;
    label.classList.add("active");
  };

  return (
    <div className="radio-group">
      {options.map((option) => (
        <label key={option.value}
               onClick={handleLabelClick}
               className={option.value === selected ? "active" : ""}
        >
          <input
            type="radio"
            value={option.value}
            checked={option.value === selected}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

function Variations({ product, selectedVariant, onVariantChange }) {

  const [options, setOptions] = useState(selectedVariant.options);

  const optionChange = (index, value) => {
    const selectedOptions = [...options];
    selectedOptions[index] = value;
    setOptions(selectedOptions);

    const variant = product.variants.find(variant => selectedOptions.join(",") === variant.options.join(","));

    if(variant){
      onVariantChange(variant);
      window.history.replaceState(
        {},
        '',
        `${window.location.href.split("?")[0]}?variant=${variant.id}`,
      );
    }

  }

  return (
    <div className="variations">
      {product.options.map((option, index) => (
        <div key={index}>
          <h3>{option.name}</h3>
          <RadioGroup
            options={option.values.map((value) => ({
              label: value,
              value: value,
            }))}
            selected={options[index]}
            onChange={(value) =>
              optionChange(index, value)
            }
          />
        </div>
      ))}
    </div>
  );
}

function ProductForm({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  const [qty, setQty] = useState(1);
  const handleAddToCartClick = () => {


    addItem(selectedVariant.id, {quantity: qty, properties: {}}).then(() => {
      console.log("Product added to cart");
    });
  };
  const handleQtyChange = (event) => {
    setQty(event.target.value);
  };


  console.log(selectedVariant)

  return (
    <div>
      <div className="product-form-react">
        <div className="product-form-react__title">
          <h1>{product.title}</h1>
        </div>
        <div className="product-form-react__price">
          ${selectedVariant.priceV2.amount}
        </div>
        <div className="product-form-react__variations">
          <Variations
            product={product}
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
          />
        </div>
        <div className="product-form-react__add-to-qty">
          <p>Quantity</p>
          <input onChange={handleQtyChange}
                 defaultValue="1"
                 className="" type="number" name="qty" id="qty"
                 data-cart-quantity="0" data-min="1" min="1" step="1"
                 form="product-form-react" max="null"/>
        </div>
        <div className="product-form-react__add-to-cart" >
          <button onClick={handleAddToCartClick}>Add to cart</button>
        </div>
        <div className="product-form-react__description">
          {product.description}
        </div>
      </div>

    </div>
  );
}

const ProductPage = ({ sectionData }) => {
  const { loading, error, data } = useQuery(queries.GET_PRODUCT_BY_HANDLE, {
    variables: {
      handle: sectionData.product.handle,
    },
  });

  if (loading)
    return (
      <div className="product-main__loader">
       loading
      </div>
    );
  if (error) console.warn(error);

  const product = formatProduct(data.product);

  console.log('product', product)

  return (
    <ProductForm product={product}/>
  )
};

const entryPoint = document.getElementById("product-page-react-entrypoint");
const sectionData = scrapeSectionData(entryPoint);
const root = ReactDOM.createRoot(entryPoint);

root.render(
  <ApolloProvider client={client}>
    <ProductPage sectionData={sectionData} />
  </ApolloProvider>
);
