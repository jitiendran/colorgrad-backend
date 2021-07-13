# colorgrad-backend

## Schema

### User_Info

| Names           | Types       |
| --------------- | ----------- |
| Username        | String      |
| Email           | String      |
| Password        | String      |
| LinkedinProfile | String      |
| GithubProfile   | String      |
| Colors          | [Colors]    |
| Gradients       | [Gradients] |
| Followers       | [User]      |
| Following       | [User]      |
| No_Of_Colors    | Number      |
| No_Of_Gradients | Number      |
| Rating          | Number      |
| Token           | String      |
| Profile         | String      |

## Colors

| Names    | Types  |
| -------- | ------ |
| Username | String |
| Color    | String |
| Type     | String |
| UsedBy   | Number |

## Gradients

| Names     | Types    |
| --------- | -------- |
| Username  | String   |
| Color     | [String] |
| Type      | String   |
| Direction | String   |
| UsedBy    | Number   |

---

**Note**
The rating will be calculated only on adding and when the uses increases

---

## Formula

1. Contribution = No_Of_Colors + No_Of_Gradients
2. UsedBy_All = UsedBy_Colors + UsedBy_Gradients
3. Rating += Contribution \* UsedBy_All / No_Of_Days in the month

## Operations

1. Register user
2. Login user
3. Insert color
4. Get colors
5. Get myColors
6. Insert gradient
7. Get gradients
8. Get myGradients
9. Add friend
10. User Rating
11. Copy Color
12. Copy Gradient
13. Add Favourite Color
14. Add Favourite Gradient
15. Remove Favourite Color
16. Remove Favourite Gradient
17. Upload Profile Image
18. Update Profile
