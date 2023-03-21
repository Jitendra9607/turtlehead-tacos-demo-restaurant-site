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
import * as React from "react";
import Banner from "../components/Banner";
import Details from "../components/Details";
import Hours from "../components/Hours";
import List from "../components/List";
import PageLayout from "../components/PageLayout";
import StaticMap from "../components/StaticMap";
import Favicon from "../public/yext-favicon.ico";
import "../index.css";
import EditTool from "../components/EditTool";
import { isProduction } from "@yext/pages/util";
import Nearby from "../components/Nearby";
import { nearByLocation } from "../types/nearByLocation";
import { AnswerExperienceConfig } from "../config/answersHeadlessConfig";

/**
 * Required when Knowledge Graph data is used for a template.
 */
export const config: TemplateConfig = {
  stream: {
    $id: "my-stream-id-1",
    // Specifies the exact data that each generated document will contain. This data is passed in
    // directly as props to the default exported function.
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "address",
      "mainPhone",
      "hours",
      "slug",
      "timezone",
      "yextDisplayCoordinate",
      "displayCoordinate",
      "cityCoordinate"
    ],
    // Defines the scope of entities that qualify for this stream.
    filter: {
      entityTypes: ["location"],
    },
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
    ? document.slug
    : `${document.locale}/${document.address.region}/${document.address.city}/${document.address.line1
    }-${document.id.toString()}`;
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
type ExternalApiData = TemplateProps & { externalApiData: nearByLocation };
export const transformProps: TransformProps<ExternalApiData> = async (
  data: any
) => {

  var location = `${data.document.yextDisplayCoordinate ? data.document.yextDisplayCoordinate.latitude : data.document.displayCoordinate.latitude},${data.document.yextDisplayCoordinate ? data.document.yextDisplayCoordinate.longitude : data.document.displayCoordinate.longitude}`;

  const url = `${AnswerExperienceConfig.endpoints.verticalSearch}?experienceKey=${AnswerExperienceConfig.experienceKey}&api_key=${AnswerExperienceConfig.apiKey}&v=20220511&version=${AnswerExperienceConfig.experienceVersion}&locale=${AnswerExperienceConfig.locale}&location=${location}&verticalKey=${AnswerExperienceConfig.verticalKey}&limit=4&retrieveFacets=true&skipSpellCheck=false&sessionTrackingEnabled=true&source=STANDARD`;

  const externalApiData = (await fetch(url).then((res: any) =>
    res.json()

  )) as nearByLocation;
  return { ...data, externalApiData };
};
type ExternalApiRenderData = TemplateRenderProps & {
  externalApiData: nearByLocation;
};
const Location: Template<ExternalApiRenderData> = ({
  relativePrefixToRoot,
  path,
  document,
  externalApiData
}) => {
  const {
    name,
    address,
    hours,
    mainPhone,
    geocodedCoordinate,
    services,
    description,
    siteDomain,
  } = document;
  return (
    <>
      <PageLayout>
        <Banner name={name} address={address} />
        <div className="centered-container">
          <div className="section">
            <div className="grid grid-cols-2 gap-x-10 gap-y-10">
              <div className="bg-gray-100 p-2">
                <Details address={address} phone={mainPhone}></Details>
                {services && <List list={services}></List>}
              </div>
              <div className="bg-gray-100 p-2">
                {hours && <Hours title={"Restaurant Hours"} hours={hours} />}
              </div>
              {geocodedCoordinate && (
                <StaticMap
                  latitude={geocodedCoordinate.latitude}
                  longitude={geocodedCoordinate.longitude}
                ></StaticMap>
              )}
              <div className="bg-gray-100 p-2">
                <div className="text-xl font-semibold">{`About ${name}`}</div>
                <p className="pt-4">{description}</p>
              </div>
            </div>
          </div>
        </div>
      <Nearby externalApiData={externalApiData} />
      </PageLayout>
      {/* This component displays a link to the entity that represents the given page in the Knowledge Graph*/}
      {!isProduction(siteDomain) && <EditTool data={document} />}
    </>
  );
};

export default Location;
