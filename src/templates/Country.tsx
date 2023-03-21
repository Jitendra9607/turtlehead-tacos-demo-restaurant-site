/**
 * This is an example of how to create a template that makes use of streams data.
 * The stream data originates from Yext's Knowledge Graph. When a template in
 * concert with a stream is built by the Yext Pages system, a static html page
 * is generated for every corresponding (based on the filter) stream document.
 *
 * Another way to think about it is that a page will be generated using this
 * template for every eligible entity in your Knowledge Graph.
 */

import {
    GetHeadConfig,
    GetPath,
    GetRedirects,
    HeadConfig,
    Template,
    TemplateConfig,
    TemplateProps,
    TemplateRenderProps,
    TransformProps,
  } from "@yext/pages";
  import { fetch } from "@yext/pages/util";
  import * as React from "react";
  import Banner from "../components/Banner";
  import PageLayout from "../components/PageLayout";
  import BreadCrumbs from "../components/BreadCrumbs";
  import StaticMap from "../components/StaticMap";
  import Favicon from "../public/yext-favicon.ico";
  import "../index.css";
  
  
  /**
   * Required when Knowledge Graph data is used for a template.
   */
  export const config: TemplateConfig = {
    stream: {
      $id: "location-country",
      filter: {
        savedFilterIds: ["dm_test-location-directory_address_countrycode"],
      },
      // Specifies the exact data that each generated document will contain. This data is passed in
      // directly as props to the default exported function.
      fields: [
        "id",
        "uid",
        "meta",
        "name",
        "slug",
        "dm_childEntityIds",
        "dm_directoryChildren.name",
        "dm_directoryChildren.slug",
        "dm_directoryChildren.dm_baseEntityCount",
        "dm_directoryParents",
        "dm_baseEntityCount"
      ],
      // The entity language profiles that documents will be generated for.
      localization: {
        locales: ["en"],
        primary: false,
      },
    },
  };
  
  /**
   * Defines the path that the generated file will live at for production.
   *
   * NOTE: To preview production URLs locally, you must return document.slug from this function
   * and ensure that each entity has the slug field pouplated.
   */
  export const getPath: GetPath<TemplateProps> = ({ document }) => {
    return document.slug
  };
  
  /**
   * Defines a list of paths which will redirect to the path created by getPath.
   *
   * NOTE: This currently has no impact on the local dev path. Redirects will be setup on
   * a new deploy.
   */
  export const getRedirects: GetRedirects<TemplateProps> = ({ document }) => {
    return [`index-old/${document.id.toString()}`];
  };
  
  /**
   * This allows the user to define a function which will take in their template
   * data and produce a HeadConfig object. When the site is generated, the HeadConfig
   * will be used to generate the inner contents of the HTML document's <head> tag.
   * This can include the title, meta tags, script tags, etc.
   */
  export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
    relativePrefixToRoot,
    path,
    document,
  }): HeadConfig => {
    return {
      title: document.name,
      charset: "UTF-8",
      viewport: "width=device-width, initial-scale=1",
      tags: [
        {
          type: "meta",
          attributes: {
            name: "description",
            content: document.description,
          },
        },
        {
          type: "link",
          attributes: {
            rel: "icon",
            type: "image/x-icon",
            href: Favicon,
          },
        },
      ],
    };
  };
  
  /**
   * This is the main template. It can have any name as long as it's the default export.
   * The props passed in here are the direct stream document defined by `config`.
   *
   * There are a bunch of custom components being used from the src/components folder. These are
   * an example of how you could create your own. You can set up your folder structure for custom
   * components any way you'd like as long as it lives in the src folder (though you should not put
   * them in the src/templates folder as this is specific for true template files).
   */
  
  
  const Country: Template<TemplateRenderProps> = ({
    relativePrefixToRoot,
    path,
    document,
  }) => {
    const {
      _site,
      name,
      dm_directoryChildren,
      description,
      dm_baseEntityCount,
      siteDomain,
      dm_childEntityIds,
      dm_directoryParents
    } = document;
    return (
      <>
        <PageLayout>
        <BreadCrumbs name={name} parents={dm_directoryParents} baseUrl={relativePrefixToRoot}  /> 
        <div className="centered-container">
          <div className="section">
          <div className="grid grid-cols-4 gap-x-10 gap-y-10">
          {dm_directoryChildren && dm_directoryChildren.map((res:any)=>{
         return(
          <div className="bg-gray-100 p-2 shadow">
          <a href={res.slug}><h1>{res.name} ({res.dm_baseEntityCount})</h1></a>
          </div>
         )
        })}
          </div>
          </div>
          </div>
        </PageLayout>
        
        {/* This component displays a link to the entity that represents the given page in the Knowledge Graph*/}
        
      </>
    );
  };
  
  export default Country;
  