import React, { useState, useEffect } from "react";
import { useUrlActions } from "../context/hooks/useUrlActions";
import { Url } from "../context/store";

interface UpdateFormProps {
  isOpenUpdate: boolean;
  url: Url;
  setIsOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  isOpenUpdate,
  setIsOpenUpdate,
  url,
}) => {
  const { updateUrl, error } = useUrlActions();
  const [inputs, setInputs] = useState({
    originalUrl: "",
    shortUrl: "",
  });

  useEffect(() => {
    setInputs({ ...url });
  }, [url]);

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...url, [e.target.id]: e.target.value });
  };

  return (
    <>
      {url && isOpenUpdate && (
        <div className=" w-screen h-screen absolute top-0 left-0 flex bg-opacity-55  bg-slate-600 justify-center items-center">
          <div className="modal-box">
            <h2>Update URL</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateUrl(url._id, { ...url, ...inputs });
                setIsOpenUpdate(false);
              }}
            >
              <div className="form-control">
                <label htmlFor="originalUrl" className="label">
                  Original URL
                </label>
                <input
                  type="text"
                  id="originalUrl"
                  value={inputs.originalUrl}
                  onChange={handleChanges}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="shortUrl" className="label">
                  Short URL
                </label>
                <input
                  type="text"
                  id="shortUrl"
                  value={inputs.shortUrl}
                  onChange={handleChanges}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control justify-evenly gap-4 py-4 flex-row">
                <button type="submit" className="btn flex-1 btn-primary">
                  Update
                </button>
                <button
                  onClick={() => setIsOpenUpdate(false)}
                  className="btn flex-1 btn-error"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateForm;
