
Find and Send messages:
----------------------------------------

https://pushpr.localtunnel.me/push/find

Request:
{
  "tag":"iOS",
  "message":"Welcome to PayRange Again!",
  "send":true
}

// set send to false for only looking at users selected

Response:
{
  "message": "Notifications sent",
  "users": [
    {
      "name": "1",
      "id": "06ecbb3c81c493838db0017ab2a524ce"
    },
    {
      "name": "Rakesh",
      "id": "0c3484ecd8a7cefdc9b68c71714215fc"
    },
    {
      "name": "Rakesh Kulangara",
      "id": "288ddb2a02002542a54d144755029027"
    },
    {
      "name": "Sowmya",
      "id": "2be1d18f223f0755c8717e3f3d2f8a8c"
    },
    {
      "name": "Rajat",
      "id": "334fbab80e0f6a743acdcd6583c98c3a"
    }
  ]
}




Send to Particular User:
----------------------------------------

https://pushpr.localtunnel.me/push/user

{
  "userId": "2be1d18f223f0755c8717e3f3d2f8a8c",
  "message": "User Id Yes!"
}


Response:
Pushed to Device through APN.




Send Raw Message to One Device:
----------------------------------------

https://pushpr.localtunnel.me/push

{
  "token": "<863c1ef0 5ac2058c 9b57068b cfbda3bc 7f827466 7817eb8d 9e8d029f d2b8cb8e>",
  "message": "Some Message to send",
  "sender": "PayRange"
}

Response:

 Pushed to Device through APN.



Send Raw Message to Multiple Devices:
----------------------------------------

https://pushpr.localtunnel.me/push/multi


{
  "token": ["<863c1ef0 5ac2058c 9b57068b cfbda3bc 7f827466 7817eb8d 9e8d029f d2b8cb8e>","<4505e180 bdf42fa3 7b450940 c5f78606 10dc3082 9ba704d2 b72570d6 fb1aae13>","<863c1ef0 5ac2058c 9b57068b cfbda3bc 7f827466 7817eb8d 9e8d029f d2b8cb8e>"],
  "message": "",
  "sender": "PayRange"
}

Response:

 Pushed to Device through APN.
