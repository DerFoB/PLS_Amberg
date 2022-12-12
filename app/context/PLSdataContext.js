/////////////////////////////////////////////
// FileName: UserContext.js
// Autor: Fabian Kraus
// Erstellt am: 12.12.2022 - 21:37
// letzte Änderung: 07.06.2022 - 17:30
// Beschreibung: Übergibt den Usernamen und den Raum, in welchem sich der User befindet, unter Geschwister-Komponenten.
//               Allgemein werden hier variablen gesetzt, die mithilfe des ContextProviders an components weitergegeben werden können.
//               In diesen components muss dann n ur wieder der Context gesetzt werden, um die Variablen/Funktionen aufzurufen.
/////////////////////////////////////////////

import React, { createContext, Component } from "react";

export const PLSDataContext = createContext();

class PLSDataContextProvider extends Component {
  state = {
    plsData: [],
  };

  getPLSData = async () => {
    setFetching(true);
    try {
      const jsonValue = await AsyncStorage.getItem("@PLSData");
      return this.setState(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <PLSDataContext.Provider
        value={{ ...this.state, getPLSData: this.getPLSData }}
      >
        {this.props.children}
      </PLSDataContext.Provider>
    );
  }
}

export default PLSDataContextProvider;
