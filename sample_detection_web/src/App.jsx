import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  useParams,
} from "react-router-dom";
import Header from "./components/header";
import React, { useContext, useEffect, useRef } from "react";
import { formatDistance } from "date-fns";
import Webcam from "react-webcam";

import { SessionContext, SessionProvider } from "./sessionContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/results/:id",
        element: <ViewResults />,
      },
    ],
  },
]);

/**
 *
 * @param {import("react").PropsWithChildren} props
 * @returns {import("react").JSX.Element}
 */
function ViewResults() {
  let { id } = useParams();

  return <img src={`/api/v1/inference_image/${id}`} alt={id} />;
}

/**
 *
 * @param {string} dataURI
 * @returns {Blob}
 */
function DataURIToBlob(dataURI) {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
}

const videoConstraints = {
  width: 1280,
  height: 720,
  // facingMode: "user",
  facingMode: "environment",
};

/**
 *
 * @param {import("react").PropsWithChildren<{onImageCapture: (string) => void}>} props
 * @returns {import("react").JSX.Element}
 */
function ImageInput({ onImageCapture }) {
  const webcamRef = useRef();
  const captureScreenshot = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();

    onImageCapture(imageSrc);
  }, [onImageCapture, webcamRef]);

  return (
    <div
      className={`m-2 gap-2 flex flex-col p-6 mx-auto rounded-lg border-2 border-dotted border-slate-400 max-w-4xl`}
    >
      <Webcam
        audio={false}
        height={videoConstraints.height}
        width={videoConstraints.width}
        disablePictureInPicture={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />

      <button
        onClick={captureScreenshot}
        className="space-x-1 bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white px-6 py-2 rounded-lg w-full flex items-center justify-center sm:w-auto"
      >
        {/* Drag file(s) here or  */}
        Capture
      </button>
    </div>
  );
}

/**
 *
 * @param {import('react').PropsWithChildren<{results: string[]}>} props
 * @returns {import("react").JSX.Element}
 */
function InferenceList({ results }) {
  return (
    <ul className="list-disc mt-4 mx-auto inline-flex flex-col">
      {results.map((result) => {
        return (
          <li key={result.id}>
            <Link to={`/results/${result.id}`}>
              <span>{result.id}</span>
              <span className="ml-2 text-slate-600">
                {formatDistance(new Date(result.timestamp), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Home() {
  const { user, room, results, setResults } = useContext(SessionContext);

  useEffect(() => {
    if (typeof user !== "undefined" && typeof room !== "undefined") {
      let inferenceListUrl = new URL(
        window.location.protocol +
          "//" +
          window.location.host +
          "/api/v1/inference_request"
      );
      inferenceListUrl.search = new URLSearchParams({ user, room }).toString();
      fetch(inferenceListUrl, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((response) => {
          setResults(
            response.map((req) => ({
              id: req["_value"],
              timestamp: req["_time"],
            }))
          );
        })
        .catch((error) => console.log(error));
    } else {
      setResults([]);
    }
  }, [room, user, setResults]);

  return (
    <>
      {typeof user !== "undefined" && typeof room !== "undefined" ? (
        <ImageInput
          onImageCapture={(imageSrc) => {
            const files = DataURIToBlob(imageSrc);

            const formData = new FormData();

            formData.set("user", user);
            formData.set("room", room);
            formData.set("files", files);

            fetch("/api/v1/inference", {
              method: "post",
              body: formData,
            })
              .then((response) => response.json())
              .then((response) => {
                if (
                  typeof response !== "undefined" &&
                  Array.isArray(response)
                ) {
                  setResults([...results, response[0]]);
                }
              });
          }}
        />
      ) : (
        <pre className="text-center pt-12 text-slate-600 select-none">
          Select user and room to begin
        </pre>
      )}

      <InferenceList results={results} />
    </>
  );
}

function Root() {
  return (
    <SessionProvider>
      <div className="px-1 flex flex-col items-center justify-center">
        <Header />
        <Outlet />
      </div>
    </SessionProvider>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
