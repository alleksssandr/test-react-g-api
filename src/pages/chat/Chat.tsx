import './Chat.css'

import waImg from '../../assets/wa.svg'

import { useAuthStore } from "../../store/authStore";
import Button from '../../ui/button/Button';
import Field from '../../ui/field/Field';
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '../../api/client';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

export interface IGreenApiNotification {
  receiptId?: number;
  body?: {
    typeWebhook: string;
    instanceData: {
      idInstance: number;
      wid: string;
      typeInstance: string;
    };
    timestamp: number;
    idMessage: string;
    senderData: {
      chatId: string;
      sender: string;
      senderName: string;
    };
    messageData: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
      fileMessageData?: {
        downloadUrl: string;
        caption: string;
        fileName: string;
      };
    };
  };
}

interface IMessage extends IGreenApiNotification {
  error?: string

  text?: string
  date?: number
}

function PageAuthorization() {

  const restore = useAuthStore((state) => state.restore)

  const navigate = useNavigate()

  const url = useAuthStore((state) => state.url)
  const idInstance = useAuthStore((state) => state.idInstance)
  const apiTokenInstance = useAuthStore((state) => state.apiTokenInstance)

  const [isSelectedNumber, setSelectedNumber] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('79138103042');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);


  const isMountedRef = useRef(true);
  const timeoutRef = useRef<number | null>(null);

  const poll = useCallback(async () => {
    if (!isMountedRef.current || !isSelectedNumber) return;


    try {
      const notification = await (await apiClient.get<IGreenApiNotification>(`${url}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`)).data || null

      console.log('!!!notification: ', notification);
      

      if (isMountedRef.current && notification) {
        setMessages((prev) => [notification, ...prev]);
      }

      if (isMountedRef.current && isSelectedNumber) {
        // eslint-disable-next-line react-hooks/immutability
        timeoutRef.current = setTimeout(poll, 2500);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      if (isMountedRef.current) {
        timeoutRef.current = setTimeout(poll, 5000);
      }
    }
  }, [apiTokenInstance, idInstance, isSelectedNumber, url]);

  useEffect(() => {
    isMountedRef.current = true;

    if (isSelectedNumber) {
      poll();
    }

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [poll, isSelectedNumber]);


  const handleLogout = () => {
    // 
    restore()
    navigate('/chat')
  }

  const handleCreateChat = () => {
    setSelectedNumber(true)
  }

  const handleSendMessage = async () => {
    try {
      await apiClient.post<void>(`${url}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
        "chatId": `${phoneNumber}@c.us`,
        "message": message,
      })

      setMessages([...messages, { text: message, date: new Date().getTime() }])
      setMessage('')
    } catch (error) {
      setMessages([...messages, { error: (error as AxiosError).message, date: new Date().getTime()}])
    }
  }


  const getMsgClass = (m: IMessage): string => {
    return 'chat__message ' + (m.error?.length ? 'error' : m.text?.length ? 'out' : 'in')
  }

  return (
    <>
      <div className="chat">
        {/* HEADER */}
        <div className='chat__head'>
          <div className='chat__head-left'>
            <img src={waImg} width="20" height="20" alt="" />
            <span>
              {url}
            </span>
            <span>
              {idInstance}
            </span>
          </div>

          <Button
            variant='primary'
            children='Change'
            onClick={handleLogout}
          />
        </div>

        {/* CONTENT */}
        <div className='chat__content-wrap'>
          {!isSelectedNumber ?

            // NEW CHAT
            <div className='chat__content'>
              <p>
                New chat
              </p>

              <Field
                placeholder='Phone Number'
                value={phoneNumber}
                onChange={setPhoneNumber}
                onSend={handleCreateChat}
              />

              <Button
                variant='primary'
                children='Create'
                onClick={handleCreateChat}
              />
            </div>
            :
            // CHAT
            <div className='chat__content chat__content_chat'>
              <p>
                {phoneNumber}:
              </p>

              <div className='chat__messages'>
                {messages.map((m: IMessage) => (
                  <>
                    <div className={getMsgClass(m)}>
                      <div className='chat__message-content'>
                        <p>
                        {m.error || m.text}
                        </p>
                        <div>
                          {m.date ? new Date(m.date).toLocaleTimeString() : ''}
                        </div>
                      </div>
                    </div>
                  </>
                ))}

              </div>
              <Field
                placeholder='Message'
                value={message}
                onChange={setMessage}
                onSend={handleSendMessage}
              />
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default PageAuthorization