async function getData() {
  const deviceId = 2,
    id = 1;
  const res = await fetch(
    `http://127.0.0.1:3000/data?deviceId=${deviceId}&timelapseId=${id}`,
    { method: "GET" },
  );
  console.log("RES", res);
  const data = await res.json();
  console.log(data);
}

const main = async () => {
  await getData();
  const res = await fetch(
    `http://127.0.0.1:3000/timelapse?deviceId=cam1&timelapse=titi.mp4`,
    { method: "GET" },
  );
  const data = await res.blob();
  const file = new File([data], "titi.mp4", { type: "video/mp4" });
  console.log(file);
};

main().catch(console.error);
