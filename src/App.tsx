import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Config, ImmutableX } from '@imtbl/core-sdk';
import { Passport } from '@imtbl/passport';
import { Environment, ImmutableConfiguration } from '@imtbl/config';
import { audience, logoutRedirectUri, redirectUri, scope } from './config';
import { EnvironmentNames } from './types';
import { IMXProvider } from '@imtbl/provider';
import logo from './logo.svg';
import './App.css';

const getCoreSdkConfig = (environment: EnvironmentNames) => {
  switch (environment) {
    case EnvironmentNames.Production: {
      return Config.PRODUCTION;
    }
    case EnvironmentNames.Sandbox: {
      return Config.SANDBOX;
    }
  }
}

const getPassportConfig = (environment: EnvironmentNames) => {
  const sharedConfigurationValues = {
    scope,
    audience,
    redirectUri,
    logoutRedirectUri,
  };

  switch (environment) {
    case EnvironmentNames.Production: {
      return {
        baseConfig: new ImmutableConfiguration({
          environment: Environment.PRODUCTION,
        }),
        clientId: 'PtQRK4iRJ8GkXjiz6xfImMAYhPhW0cYk',
        ...sharedConfigurationValues,
      };
    }
    case EnvironmentNames.Sandbox: {
      return {
        baseConfig: new ImmutableConfiguration({
          environment: Environment.SANDBOX,
        }),
        clientId: 'mjtCL8mt06BtbxSkp2vbrYStKWnXVZfo',
        ...sharedConfigurationValues,
      };
    }
  }
};

const ImmutableContext = createContext<{
  passportClient?: Passport,
  coreSdkClient: ImmutableX,
  environment: EnvironmentNames,
  imxProvider?: IMXProvider
  setImxProvider?: (imxProvider: IMXProvider) => void;
}>({
  coreSdkClient: new ImmutableX(getCoreSdkConfig(EnvironmentNames.Sandbox)),
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

  useEffect(() => {
    setCoreSdkClient(new ImmutableX(getCoreSdkConfig(environment)));
    setPassportClient(new Passport(getPassportConfig(environment)));
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

function LoginButton() {
  const { passportClient } = useContext(ImmutableContext);

  const callJavascript = async () => {
      await passportClient?.connectImx();
  }

  return (
    <>
      <button onClick={callJavascript}>Login</button>
    </>
  );
}

function LogoutButton() {
  const { passportClient } = useContext(ImmutableContext);

  const callJavascript = async () => {
      await passportClient?.logout();
  }

  return (
      <>
      <button onClick={callJavascript}>Logout</button>
      </>
  );
}

function LogButton() {
  const { passportClient } = useContext(ImmutableContext);

  const showLog = async () => {
    log(`logging`);
  }

  return (
      <>
      <button onClick={showLog}>Show Log</button>
      </>
  );
}

const SetupComponent = () => {
  const { passportClient, imxProvider, setImxProvider, coreSdkClient } = useContext(ImmutableContext);
  const searchParams = new URLSearchParams(document.location.search)

  useEffect(() => {
      log('setting up ts sdk functions...')

      if (searchParams.has('code')) {
          log("loggedIn")
      }

      window.ue.interface.login = async function() {
          log("logging out...")
          await passportClient?.logout();
      }

      window.ue.interface.logout = async function() {
          log("logging in...")
          await passportClient?.connectImx();
      }
      window.ue.interface.getUserInfo = async function() {
          try {
              log("Getting user info...")
              log(`passportClient is NOT null? ${passportClient !== null && passportClient !== undefined}`)
              const userInfo = await passportClient?.getUserInfo();
              log(`userInfo is NOT null? ${userInfo !== null && userInfo !== undefined}`)
              if (userInfo) {
                  window.ue5("print", {
                      "email" : userInfo.email,
                      "nickname" : userInfo.nickname,
                      "sub" : userInfo.sub
                  });
              } else {
                  log(`No user info`)
              }
          } catch (error) {
              log(`ERROR getting user info.. ${error}`)
          }
      }
      window.ue.interface.getAddress = async function() {
          try {
              log("Getting address...")
              log(`imxProvider is NOT null? ${imxProvider !== null && imxProvider !== undefined}`)
              const address = await imxProvider?.getAddress();
              log(`address is NOT null? ${address !== null && address !== undefined}`)
              if (address) {
                  window.ue5("print", {"address" : address});
              } else {
                  log(`No address`)
              }
          } catch (error) {
              window.ue5("print", {"ERROR getting address..": `${error}`});
          }
      }

      window.ue.interface.getBalance = async function() {
          try {
              log("Getting balance...")
              const response = await coreSdkClient?.getBalance({
                  address: 'eth',
                  owner: '0x0b01170789c5058dcd0c1254c571168644d18720'
              })
              if (response) {
                  window.ue5("print", {
                      "token_address" : response.token_address,
                      "symbol" : response.symbol,
                      "balance": response.balance,
                      "preparing_withdrawal": response.preparing_withdrawal,
                      "withdrawal": response.withdrawable
                  });
              } else {
                  log(`No balance response`)
              }
          } catch (error) {
              window.ue5("print", {"ERROR getting balance..": `${error}`});
          }
      }

      log('completed TS functions set up')
  }, [passportClient, imxProvider]);

  return (
      <>
      <div>Loaded script</div>
      <LoginButton />
      <LogoutButton />
      <LogButton />
      </>
  );
}

function log(message: string) {
  console.log(message)
  if (window !== null && window !== undefined
      && window.ue5 !== null && window.ue5 !== undefined) {
          window.ue5("print", {"log":message})
      }
}

function App() {
  return (
    <ImmutableProvider>
    <div className="App">
      <header className="App-header">
        <p>
          nattb8
        </p>
        <SetupComponent/>
      </header>
    </div>
    </ImmutableProvider>
  );
}

export default App;
