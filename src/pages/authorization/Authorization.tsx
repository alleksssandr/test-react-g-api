import { useState } from 'react';
import Field from '../../ui/field/Field';
import './Authorization.css'
import Button from '../../ui/button/Button';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import type { AxiosError } from 'axios';

import waImg from '../../assets/wa.svg'

function PageAuthorization() {


  const [urlAPI, setUrlAPI] = useState('https://7201.api.green-api.com');
  const [idInstance, setIdInstance] = useState('720122757071');
  const [apiTokenInstance, setApiTokenInstance] = useState('1c8e588db57c462d9bb70c159990c4eca9296e60d29148909f');

  const [error, setError] = useState('');

  const navigate = useNavigate()
  const authorize = useAuthStore((state) => state.authorize);


  const handleAuthorize = async () => {
    setError('')

    try {
      // CHECK valid input data
      await apiClient.get<void>(`${urlAPI}/waInstance${idInstance}/getChats/${apiTokenInstance}`)

      authorize(urlAPI, idInstance, apiTokenInstance)

      navigate('/chat')
    } catch (error) {
      setError((error as AxiosError).message)
    }
  }

  return (
    <>
      <div className="authorization">
        <div className="authorization__logo">
          <img src={waImg} width="50" height="50" alt="" />
        </div>
        <p>
          Authorization
        </p>


        <div className='authorization__fields'>
          <Field
            placeholder='apiUrl'
            value={urlAPI}
            onChange={setUrlAPI}
          />

          <Field
            placeholder='idInstance'
            value={idInstance}
            onChange={setIdInstance}
          />

          <Field
            placeholder='apiTokenInstance'
            value={apiTokenInstance}
            onChange={setApiTokenInstance}
          />
        </div>

        <Button
          variant='primary'
          children='Connect'
          onClick={handleAuthorize}
        />

        {
          error.length ?
            <p className="authorization__error">
              {error}
            </p>
            :
            ''
        }
      </div>
    </>
  )
}

export default PageAuthorization