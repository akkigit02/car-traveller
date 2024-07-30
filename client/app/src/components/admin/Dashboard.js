import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserRoute } from "../../services/Authentication.service";

export default function AdminDashboard() { 
  const userType = useSelector((state) => state.userInfo.userInfo.modules.userType)
  const userRoute = getUserRoute(userType)

  return (
    <div>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet iure impedit quis quibusdam, debitis nostrum modi unde quasi voluptatibus repellendus laudantium, consequuntur exercitationem ab ex dignissimos magnam? Perferendis reiciendis ipsa dolorem harum rerum, quas ex maxime corporis molestias iste eum vero inventore odit aut vel praesentium placeat perspiciatis? Assumenda dolore, aspernatur aut veritatis corporis enim non perferendis, reiciendis reprehenderit, sit perspiciatis maxime beatae aliquam possimus dolores cum eos doloremque ea quisquam vel nemo cumque error. Ratione officia ab ipsum consequatur corrupti nam! Nostrum autem eum placeat, eligendi nisi quo quam debitis amet error. Odit temporibus repellendus aliquam! Vitae quo dolorum itaque dicta animi at voluptate voluptatem, sit, nemo rerum, officiis rem eius tempora error totam reprehenderit similique veritatis est soluta alias exercitationem ut? Optio maxime labore accusamus sint, sequi illum voluptate unde omnis quia officia molestiae alias ratione ad fugit minus veniam velit cumque! Facere modi sed dolores voluptatibus, sequi similique itaque nihil eaque magni incidunt quia placeat officiis molestiae autem iusto nobis ex voluptatum ad est ea alias iure atque. Necessitatibus eveniet quia eligendi ut dignissimos ducimus corporis, cupiditate cumque, molestiae impedit esse laboriosam! Repellat amet dignissimos tempora, voluptatem tempore similique, laudantium iusto accusantium excepturi nostrum, a recusandae. Quas, quos facere recusandae accusamus ducimus numquam saepe deserunt voluptatem soluta iusto sed consequatur, ut aspernatur maxime nostrum illo tempora sapiente nihil magnam fugiat veritatis quisquam! Consequuntur neque explicabo, eius similique minus ipsam quisquam quos. Rem ab id laborum quas iusto ad pariatur minima eum laboriosam soluta inventore, dolore dolorem odio facere optio, accusantium corporis suscipit aliquid, aspernatur dolor maiores ea at. Velit vel ipsa ipsam! Maiores officia quas molestias quam harum quis minima vel iste ipsum doloremque similique, porro sint consequatur eius nemo inventore reprehenderit architecto perferendis? Amet, tempora voluptatibus eveniet fugit molestias temporibus omnis, doloremque labore aspernatur a soluta!
      </div>
  );
}
