import React, { createContext, useContext, useEffect, useState } from 'react';
import { Config, ImmutableX } from '@imtbl/core-sdk';
import { Passport, User } from '@imtbl/passport';
import { Environment, ImmutableConfiguration } from '@imtbl/config';
import { audience, logoutRedirectUri, redirectUri, scope } from './config';
import { EnvironmentNames } from './types';
import { IMXProvider } from '@imtbl/provider';
import './App.css';
import { Magic } from 'magic-sdk';

var ready = false;

const magic = new Magic('pk_live_4058236363130CA9', { 
  network: 'goerli',
});

const getPassportConfig = () => {
  const sharedConfigurationValues = {
    scope,
    audience,
    redirectUri,
    logoutRedirectUri,
  };

  return {
    baseConfig: new ImmutableConfiguration({
      environment: Environment.SANDBOX,
    }),
    clientId: 'mjtCL8mt06BtbxSkp2vbrYStKWnXVZfo',
    ...sharedConfigurationValues,
  };
};

const ImmutableContext = createContext<{
  passportClient?: Passport,
  coreSdkClient: ImmutableX,
  environment: EnvironmentNames,
  imxProvider?: IMXProvider
  setImxProvider?: (imxProvider: IMXProvider) => void
}>({
  coreSdkClient: new ImmutableX(Config.SANDBOX),
  environment: EnvironmentNames.Sandbox
});

export const ImmutableProvider = ({
  children,
}: { children: JSX.Element | JSX.Element[] }) => {
  const environment = EnvironmentNames.Sandbox
  const [coreSdkClient, setCoreSdkClient ] = useState<ImmutableX>(
    useContext(ImmutableContext).coreSdkClient,
  );
  const [passportClient, setPassportClient] = useState<Passport>();
  const [imxProvider, setImxProvider] = useState<IMXProvider>();
  const [logs, setLogs] = useState<String>();

  useEffect(() => {
    setCoreSdkClient(new ImmutableX(Config.SANDBOX));
    setPassportClient(new Passport(getPassportConfig()));
  }, [environment]);

  return (
    <ImmutableContext.Provider value={{ coreSdkClient, passportClient, environment, imxProvider, setImxProvider }}>
      {children}
    </ImmutableContext.Provider>
  );
};

export function useImmutableProvider() {
  const { coreSdkClient, passportClient, environment, imxProvider, setImxProvider } = useContext(ImmutableContext);
  return { coreSdkClient, passportClient, environment, imxProvider, setImxProvider };
}

const SetupComponent = () => {
  const { passportClient, imxProvider, coreSdkClient, setImxProvider } = useContext(ImmutableContext);

  useEffect(() => {
    const handleLoginCallback = async () => {
      try {
        const imxProvider = await passportClient?.loginCallback()
        // console.log(`imxProvider ${imxProvider}`);
        // console.log(`passportClient ${passportClient}`);
        if (imxProvider !== null && imxProvider !== undefined) {
          console.log("IMX provider set");
          setImxProvider?.(imxProvider);
          callbackToUnity("IMX_PROVIDER_SET");
        } else {
          // console.log("no imx provider");
        }
      } catch (err) {
        console.log(`handleLoginCallback error ${err}`)
      }
    }

    handleLoginCallback();
  }, [passportClient, setImxProvider]);

  const callbackToUnity = function(message: string) {
    console.log(message);
    if (window.UnityPostMessage != undefined) {
      window.UnityPostMessage(message);
    }
  }

  useEffect(() => {
      window.callFunction = async function(jsonData: string) {
        try {
          window.console.log(`callFunction data: ${jsonData}`);
          let json = JSON.parse(jsonData);
          let fxName = json["fxName"] as string;
          let requestId = json["requestId"] as string;
          window.console.log(`requestId ${requestId}...`);
          switch(fxName) {
            case "connect": {
              window.console.log(`Calling connect...${passportClient != null}`);
              await passportClient?.connectImx();
              break;
            }
            case "getAddress": {
              window.console.log(`Calling getAddress...${imxProvider != null}`);
              const address = await imxProvider?.getAddress();
              callbackToUnity(
                JSON.stringify({
                  responseFor: fxName,
                  requestId: requestId,
                  address: address
                }
              ));
              break;
            }
            case "logout": {
              window.console.log(`Calling logout...${passportClient != null}`);
              await passportClient?.logout();
              break;
            }
          }
        } catch (error) {
          window.console.log(error);
        }
      }

      window.initialise = function() {
        window.registerFunction(window.callFunction);
      }

      window.getImxProvider = async function(jsonData: string) {
        try {
        console.log(`getImxProvider jsonData: ${jsonData} ${passportClient}`);
        let user = JSON.parse(jsonData) as User;
        console.log(`getImxProvider user: ${user} ${user.accessToken}`);
        let provider = await passportClient?.getImxProvider(user);
        console.log(`provider: ${provider}`);
        } catch (error) {
          console.log(`getImxProvider error ${error}`);
        }
      }

      if (!ready) {
        callbackToUnity("IMX_FUNCTIONS_READY");
        ready = true;
      }

  }, [passportClient, imxProvider, coreSdkClient]);

  return (
      <>
      </>
  );
}

function App() {
  return (
    <ImmutableProvider>
    <div className="App">
      <header className="App-header">
        <p>
          nattb8 Unity GetProvider
        </p>
        <SetupComponent/>
      </header>
    </div>
    </ImmutableProvider>
  );
}

export default App;
