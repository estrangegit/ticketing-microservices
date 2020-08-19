import axios from 'axios';
import { useState } from 'react';

export default function useRequest({ url, method, body, onsuccess }) {
  const [errors, setErrors] = useState(null);

  async function doRequest() {
    setErrors(null);
    try {
      const response = await axios[method](url, body);
      if (onsuccess) {
        onsuccess(response.data);
      }
      return response.data;
    } catch (catchedErr) {
      setErrors(
        <div className='alert text-danger'>
          <ul className='list-group list-group-flush'>
            {catchedErr.response.data.errors.map((err) => {
              return (
                <li className='list-group-item' key={err.message}>
                  {err.message}
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }

  return { doRequest, errors };
}
