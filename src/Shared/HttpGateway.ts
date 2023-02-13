class HttpGateway {
  get = async (path: RequestInfo | URL) => {
    const response = await fetch(path);
    const dto = response.json();
    return dto;
  };

  post = async (
    path: RequestInfo | URL,
    requestDto: { name: any; author: any; ownerId: string }
  ) => {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify(requestDto),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseDto = response.json();
    return responseDto;
  };
}

const httpGateway = new HttpGateway();
export default httpGateway;
