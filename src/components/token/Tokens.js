import React from "react";
import { Box, Flex } from "theme-ui";
import shortid from "shortid";
import SimpleBar from "simplebar-react";

import ListToken from "./ListToken";
import ProxyToken from "./ProxyToken";

import SelectTokensButton from "./SelectTokensButton";

import { fromEntries } from "../../helpers/shared";

import useSetting from "../../hooks/useSetting";

import { useAuth } from "../../contexts/AuthContext";
import { useTokenData } from "../../contexts/TokenDataContext";

const listTokenClassName = "list-token";

function Tokens({ onMapTokenStateCreate }) {
  const { userId } = useAuth();
  const { ownedTokens, tokens, updateToken } = useTokenData();
  const [fullScreen] = useSetting("map.fullScreen");

  function handleProxyDragEnd(isOnMap, token) {
    if (isOnMap && onMapTokenStateCreate) {
      // Create a token state from the dragged token
      onMapTokenStateCreate({
        id: shortid.generate(),
        tokenId: token.id,
        owner: userId,
        size: token.defaultSize,
        label: "",
        statuses: [],
        x: token.x,
        y: token.y,
        lastModifiedBy: userId,
        lastModified: Date.now(),
        rotation: 0,
        locked: false,
        visible: true,
      });
      // Update last used for cache invalidation
      // Keep last modified the same
      updateToken(token.id, {
        lastUsed: Date.now(),
        lastModified: token.lastModified,
      });
    }
  }

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "80px",
          minWidth: "80px",
          overflow: "hidden",
          display: fullScreen ? "none" : "block",
        }}
      >
        <SimpleBar style={{ height: "calc(100% - 48px)", overflowX: "hidden" }}>
          {ownedTokens
            .filter((token) => !token.hideInSidebar)
            .map((token) => (
              <ListToken
                key={token.id}
                token={token}
                className={listTokenClassName}
              />
            ))}
        </SimpleBar>
        <Flex
          bg="muted"
          sx={{
            justifyContent: "center",
            height: "48px",
            alignItems: "center",
          }}
        >
          <SelectTokensButton />
        </Flex>
      </Box>
      <ProxyToken
        tokenClassName={listTokenClassName}
        onProxyDragEnd={handleProxyDragEnd}
        tokens={fromEntries(tokens.map((token) => [token.id, token]))}
      />
    </>
  );
}

export default Tokens;
