import React, { useState } from "react";
import { useUrlActions } from "../context/hooks/useUrlActions";
import UpdateForm from "./UpdateForm";
import { Url } from "../context/store";

const UrlList: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { urls, deleteUrl } = useUrlActions();
  const [selectUrl, setSelectUrl] = useState<Url | null>(null);
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false);

  return (
    <>
      <div className="overflow-x-auto p-2 rounded-md bg-base-200">
        <table className="table">
          <thead>
            <tr className="text-center">
              <th></th>
              <th>originalUrl</th>
              <th>shortUrl</th>
              <th>clicks</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url, i) => (
              <tr key={url._id} className="bg-base-100 text-center">
                <th>{i + 1}</th>
                <td>{url.originalUrl}</td>
                <td>
                  <a
                    className="text-blue-500"
                    href={apiUrl + url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url.shortUrl}
                  </a>
                </td>
                <td>{url.clicks}</td>
                <td className="flex space-x-2 justify-center">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(apiUrl + url.shortUrl)
                    }
                    className="btn btn-sm btn-primary"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => {
                      setSelectUrl(url);
                      setIsOpenUpdate(true);
                    }}
                    className="btn btn-sm btn-accent"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => deleteUrl(url._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectUrl && (
        <UpdateForm
          url={selectUrl}
          isOpenUpdate={isOpenUpdate}
          setIsOpenUpdate={setIsOpenUpdate}
        />
      )}
    </>
  );
};

export default UrlList;
