import {PrismaClient} from '@prisma/client';
import moment from 'moment';
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

  console.log('req params', req.query);
  console.log('req body', req.body);

  const prisma = new PrismaClient();

  try {
    if (req.method === 'GET') { // list
      const {offset = "0", limit = "10"}: { offset: string, limit: string } = req.query;
      const users = await prisma.user.findMany({
        skip: parseInt(offset, 10),
        take: parseInt(limit, 10),
        orderBy: [
          {
            id: 'desc',
          },
        ]
      });
      const count = await prisma.user.count();
      res.status(200).json({users, count});

    } else if (req.method === 'POST') { // create

      const user = req.body;
      if (!!user.birthDate) {
        user.birthDate = moment.utc(user.birthDate).toDate();
      }
      const result = await prisma.user.create({
        data: {
          ...user,
        },
      });
      res.status(200).json(result);

    } else {
      res.status(405).json({error: 'Invalid method.'});
    }

  } catch (error) {
    res.status(500).json(error);
  }
}
