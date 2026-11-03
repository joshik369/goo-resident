// Preserve older private activation links without exposing their fragment to the server.
if(new URLSearchParams(location.hash.slice(1)).has('activate'))location.replace('/portal'+location.hash);
